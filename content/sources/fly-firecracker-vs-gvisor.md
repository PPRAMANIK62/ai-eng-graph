---
id: fly-firecracker-vs-gvisor
title: "Firecracker vs gVisor: Sandbox Isolation for Untrusted and Agent-Generated Code"
author: Daniel Botha (Fly.io)
url: https://fly.io/learn/firecracker-vs-gvisor/
published: 2026-09-09
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

A comparison of three ways to run code you didn't write: plain containers (shared host kernel), gVisor (a user-space kernel that answers system calls itself) and Firecracker (a microVM with its own guest kernel). It frames each by its threat model and cost, and says which fits an agent loop. Written by a vendor that runs Firecracker, so read with that in mind.

## Key claims

- The case: "the shell command an agent just decided to run after reading a web page" is code you did not write and cannot review. (intro)
- Containers: "The efficiency of a single shared kernel is also the exposure: gVisor’s own framing is that container escape is possible with a single vulnerability." "Seccomp narrows what a process can ask the kernel for, but a kernel bug reachable through an allowed syscall is still a host compromise." (Firecracker vs gVisor vs Docker: When Are Containers Enough?)
- When containers are enough: "If the threat is “the agent might do something stupid, or get prompt-injected into deleting the repo,” a container with scoped credentials and a locked-down network covers most of it." If someone is actively trying to break out, "you want a second kernel-sized layer." (same)
- gVisor: "The Sentry is that kernel: it intercepts the sandboxed program’s system calls and answers them itself instead of passing them to the host kernel." The Gofer mediates file access. "gVisor’s threat model is a host kernel bug." (What Is the Difference Between Firecracker and gVisor?)
- Firecracker: runs each workload "in a KVM-backed microVM with its own guest kernel", small device model, seccomp on itself, started through a jailer. "Firecracker’s threat model is that the guest kernel is already gone." Figures: boot under 125 ms, under 5 MiB overhead, up to 150 launches per second per host. (What Is the Difference / Which Is More Secure)
- Performance: "Firecracker is near-native once the guest is running; gVisor is near-native for CPU work but pays on every system call". An agent loop (git clone, npm install, tests) is "thousands of small file and socket operations, and each pays the toll." (How Do Firecracker and gVisor Compare in Performance?)
- Choice: "Choose Firecracker when the code is genuinely untrusted or syscall-heavy and you control the hardware; choose gVisor when you are on Kubernetes or inside cloud VMs and want a strong upgrade over containers without a hypervisor." (Which Should You Choose for an AI Agent Sandbox?)
- Who uses what (per the article): AWS Lambda and Vercel Sandbox on Firecracker; Google Cloud Run, GKE Sandbox and App Engine on gVisor; gVisor lists OpenAI and Anthropic (code execution in claude.ai) as users; Modal uses gVisor. (same)
- Network: "Agents need pip install and git clone, so a sandbox can be neither air-gapped nor open to the internet." "The primitive decides what a breakout costs; an egress allowlist decides what it is worth." (The Part Everyone Converges On: Egress Control)
- gVisor "is an application kernel that implements a Linux-like interface, written in a memory-safe language, Go, and running in userspace." (What Is the Difference Between Firecracker and gVisor?)
- Fly.io sells its own Firecracker-based sandboxes: "Sprites are the same substrate arranged for untrusted and agent-generated code". (Firecracker and gVisor on Fly.io)

## Visuals worth redrawing

- Three stacks side by side: container on host kernel, gVisor Sentry between app and host kernel, Firecracker guest kernel on KVM.

## My notes

- No mention of E2B. E2B's internals couldn't be confirmed from its own docs, so don't claim them.
