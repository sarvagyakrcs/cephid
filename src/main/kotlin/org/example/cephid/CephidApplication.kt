package org.example.cephid

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CephidApplication

fun main(args: Array<String>) {
    runApplication<CephidApplication>(*args)
}
