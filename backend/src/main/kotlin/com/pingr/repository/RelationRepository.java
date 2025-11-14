package com.pingr.repository;

import com.pingr.entity.Relation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
interface RelationRepository extends JpaRepository<Relation, Long> {

}