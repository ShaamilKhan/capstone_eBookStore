package com.ebookstore.repository;

import com.ebookstore.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserIdOrderByPlacedAtDesc(Long userId, Pageable pageable);

    @Query(value = """
            SELECT oi.product_id, p.category_id, COUNT(*) AS freq
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            JOIN products p ON p.id = oi.product_id
            WHERE o.user_id = :userId AND o.status != 'CANCELLED'
            GROUP BY oi.product_id, p.category_id
            ORDER BY freq DESC
            """, nativeQuery = true)
    List<Object[]> findOrderedProductsWithCategory(@Param("userId") Long userId);
}
