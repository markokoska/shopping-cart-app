package com.shoppingcart.repository;

import com.shoppingcart.entity.CartItem;
import com.shoppingcart.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProductId(User user, Long productId);
    
    @Modifying
    @Transactional
    void deleteByUser(User user);
}
