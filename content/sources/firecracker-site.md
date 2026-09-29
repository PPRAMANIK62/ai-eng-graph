---
id: firecracker-site
title: Firecracker
author: AWS (Firecracker project)
url: https://firecracker-microvm.github.io/
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The Firecracker project site. Firecracker is an open-source virtual machine monitor from AWS that runs lightweight microVMs on KVM, built for multi-tenant serverless workloads such as Lambda. It lists boot time, memory overhead, launch rate, the tiny device model and the jailer.

## Key claims

- "Firecracker is an open source virtualization technology that is purpose-built for creating and managing secure, multi-tenant container and function-based services." (intro)
- "Firecracker runs in user space and uses the Linux Kernel-based Virtual Machine (KVM) to create microVMs." (How it works)
- "Only 5 emulated devices." "Boot in <125ms." "Create up to 150 microVMs per second per host." "<5 MiB overhead per VM." (Benefits)
- It powers "15 trillion+ monthly Lambda function invocations". (Lambda MicroVMs)
- "The jailer provides a second line of defense in case the virtualization barrier is ever compromised." (How it works)

## Visuals worth redrawing

- None.

## My notes

- The NSDI '20 paper (Agache et al.) is the formal source; its abstract lacks these numbers.
