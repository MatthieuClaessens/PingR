package com.pingr.repository;

import com.pingr.entity.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface ChannelRepository extends JpaRepository<Channel, Long> {

}