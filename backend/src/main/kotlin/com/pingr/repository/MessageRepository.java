package com.pingr.repository;

import com.pingr.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface MessageRepository extends JpaRepository<Message, Long> {

}