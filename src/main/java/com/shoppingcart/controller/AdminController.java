package com.shoppingcart.controller;

import com.shoppingcart.dto.ApiResponse;
import com.shoppingcart.entity.Order;
import com.shoppingcart.entity.OrderStatus;
import com.shoppingcart.entity.Product;
import com.shoppingcart.repository.CartItemRepository;
import com.shoppingcart.repository.OrderRepository;
import com.shoppingcart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @GetMapping("/products")
    public List<Product> getAllProductsForAdmin() {
        return productRepository.findAll();
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            if (product.getName() == null || product.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product name is required"));
            }
            if (product.getPrice() == null || product.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product price must be greater than 0"));
            }
            if (product.getStock() == null || product.getStock() < 0) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Product stock cannot be negative"));
            }
            
            Product savedProduct = productRepository.save(product);
            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Error creating product: " + e.getMessage()));
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productDetails.getName());
                    product.setDescription(productDetails.getDescription());
                    product.setPrice(productDetails.getPrice());
                    product.setStock(productDetails.getStock());
                    product.setImageUrl(productDetails.getImageUrl());
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            return productRepository.findById(id)
                    .map(product -> {
                        try {
                            cartItemRepository.deleteAll(
                                cartItemRepository.findAll().stream()
                                    .filter(item -> item.getProduct().getId().equals(id))
                                    .toList()
                            );
                            
                            productRepository.delete(product);
                            return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully (removed from active carts)"));
                            
                        } catch (org.springframework.dao.DataIntegrityViolationException e) {
                            product.setActive(false);
                            productRepository.save(product);
                            return ResponseEntity.ok(new ApiResponse(true, "Product deactivated successfully (exists in order history, so marked as inactive instead of deleted)"));
                        } catch (Exception e) {
                            throw new RuntimeException("Error deleting product: " + e.getMessage(), e);
                        }
                    })
                    .orElse(ResponseEntity.status(404)
                            .body(new ApiResponse(false, "Product not found with id: " + id)));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse(false, "Error deleting product: " + e.getMessage()));
        }
    }

    @GetMapping("/orders")
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            return orderRepository.findById(id)
                    .map(order -> {
                        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
                        orderRepository.save(order);
                        return ResponseEntity.ok(new ApiResponse(true, "Order status updated"));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Invalid order status: " + status));
        }
    }
}
