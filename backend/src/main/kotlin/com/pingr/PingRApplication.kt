package com.pingr

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PingRApplication

fun main(args: Array<String>) {
    runApplication<PingRApplication>(*args)
}
