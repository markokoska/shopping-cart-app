package com.shoppingcart.controller;

import com.shoppingcart.dto.AddToCartRequest;
import com.shoppingcart.dto.ApiResponse;
import com.shoppingcart.entity.CartItem;
import com.shoppingcart.entity.Product;
import com.shoppingcart.entity.User;
import com.shoppingcart.repository.CartItemRepository;
import com.shoppingcart.repository.ProductRepository;
import com.shoppingcart.repository.UserRepository;
import com.shoppingcart.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<CartItem> getCartItems(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        return cartItemRepository.findByUser(user);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request, 
                                      @AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        Product product = productRepository.findById(request.getProductId()).orElseThrow();

        Optional<CartItem> existingItem = cartItemRepository.findByUserAndProductId(user, request.getProductId());
        
        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(cartItem);
        } else {
            CartItem cartItem = new CartItem(user, product, request.getQuantity());
            cartItemRepository.save(cartItem);
        }

        return ResponseEntity.ok(new ApiResponse(true, "Product added to cart successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartItem(@PathVariable Long id, @RequestBody AddToCartRequest request) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(id);
        if (cartItemOpt.isPresent()) {
            CartItem cartItem = cartItemOpt.get();
            cartItem.setQuantity(request.getQuantity());
            cartItemRepository.save(cartItem);
            return ResponseEntity.ok(new ApiResponse(true, "Cart item updated successfully"));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id) {
        cartItemRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Item removed from cart"));
    }
}
