package com.shoppingcart.controller;

import com.shoppingcart.dto.ApiResponse;
import com.shoppingcart.entity.*;
import com.shoppingcart.repository.*;
import com.shoppingcart.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Order> getUserOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> checkout(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        User user = userRepository.findById(userPrincipal.getId()).orElseThrow();
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Cart is empty"));
        }

        for (CartItem cartItem : cartItems) {
            if (cartItem.getProduct().getStock() < cartItem.getQuantity()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Insufficient stock for product: " + cartItem.getProduct().getName()));
            }
        }

        BigDecimal totalAmount = cartItems.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = new Order(user, totalAmount);
        order = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            product.setStock(product.getStock() - cartItem.getQuantity());
            
            OrderItem orderItem = new OrderItem(order, cartItem.getProduct(), 
                                               cartItem.getQuantity(), cartItem.getProduct().getPrice());
            orderItemRepository.save(orderItem);
        }

        cartItemRepository.deleteByUser(user);

        return ResponseEntity.ok(new ApiResponse(true, "Order placed successfully"));
    }
}
