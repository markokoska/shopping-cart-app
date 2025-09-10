package com.shoppingcart.repository;

import com.shoppingcart.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("SELECT p FROM Product p WHERE p.active = true OR p.active IS NULL")
    List<Product> findAllActive();
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')) AND (p.active = true OR p.active IS NULL)")
    List<Product> findByNameContainingIgnoreCase(@Param("name") String name);
}
