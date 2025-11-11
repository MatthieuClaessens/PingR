package com.pingr.repository;

import com.pingr.entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface StateRepository extends JpaRepository<State, Long> {

}