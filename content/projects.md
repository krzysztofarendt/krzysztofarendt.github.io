---
title: "Projects"
url: "/projects/"
summary: "Open-source projects"
---

Open-source, hobby, and independent projects I have built over the years — in
my own time, as personal work independent of any employer.

## publigen &middot; 2025&ndash;2026

An agentic system for research, monitoring, and drafting. It ingests documents
into a RAG knowledge base, continuously monitors the web for relevant
developments, and runs a multi-agent pipeline &mdash; topic scouting, planning,
drafting, claim verification and grounding, editing, and critique &mdash; to
turn that material into well-grounded drafts for expert review.

The hard parts were in the editorial pipeline: verifying each claim against its
sources and hedging or dropping the ungrounded ones, learning an author's
writing style from implicit approve/reject feedback, and keeping a human in the
loop on every draft.

A private, invite-only system, so there is no public repository. It taught me
how much effort a production-grade agentic system really takes &mdash; today I
would build much of it as Claude Code skills rather than hand-rolled
orchestration.

![Publigen architecture: source ingestion and web monitoring feeding a multi-agent backend that drafts and grounds write-ups for expert review](/images/publigen/architecture.png)

*Figure: Publigen architecture &mdash; source ingestion and web monitoring feed
a RAG store and a multi-agent backend that researches, drafts, and grounds
write-ups for expert review.*

## [building3d-rs](https://github.com/krzysztofarendt/building3d-rs) &middot; 2025&ndash;2026

Experimental Rust toolkit for procedural building geometry, simulation, and
visualization. It models buildings as structured 3D objects, then layers on mesh
generation, geometric queries, acoustic ray tracing, lighting analysis,
weather-driven thermal simulation, and Rerun-based visualization. The project
evolved into a broad research prototype: part geometry kernel, part simulation
sandbox, part benchmark playground.

The energy module includes EPW weather parsing, solar position and shading
calculations, ideal-load HVAC, finite-volume wall conduction, internal gains,
schedules, and thermal network components. It includes BESTEST-oriented examples
that compare selected ASHRAE 140 cases against OpenStudio/EnergyPlus reference
outputs from the NREL BESTEST-GSR workflow, plus regression tests and generated
comparison plots.

This is an ambitious experimental simulator, not a certified replacement for
EnergyPlus or other professional building simulation tools.

### Acoustic benchmark: BRAS CR2

To test the acoustic module, I compared simulation results against the
BRAS dataset — a peer-reviewed room acoustics
benchmark created by RWTH Aachen and TU Berlin. The test case is the CR2 small
seminar room: 5 materials, 2 sources, 5 receivers, and in-situ measured acoustic
parameters.

The simulation uses pure stochastic ray tracing with frequency-dependent
absorption, hybrid specular/diffuse reflections, ISO 9613-1 air absorption, and
Schroeder integration to estimate EDT, RT60, C80, and D50 across octave bands
(125–4000 Hz). No image sources, FEM, or wave-based solvers involved.

Reverberation time error vs. measurements: 3–15%.

![BRAS CR2 seminar room geometry with sources and receivers](/images/building3d-rs/BRAS_CR2_geometry.jpg)

*Figure: BRAS CR2 seminar room geometry with 2 sources (LS1, LS2) and 5 receivers (MP1–MP5).*

![Acoustic ray tracing — early time steps](/images/building3d-rs/BRAC_CR2_ray_tracing_1.png)

*Figure: Acoustic rays from two sources at early time steps. Visualization via Rerun.*

![Acoustic ray tracing — after multiple reflections](/images/building3d-rs/BRAC_CR2_ray_tracing_2.png)

*Figure: Rays after multiple reflections filling the room.*

![Simulated vs measured room acoustic parameters](/images/building3d-rs/BRAS_CR2_sim_vs_meas.jpg)

*Figure: Simulated vs. measured EDT, RT60, C80, and D50 across octave bands.*

## [building3d](https://github.com/krzysztofarendt/building3d) &middot; 2024&ndash;2025

First iteration of the building3d project, written in Python. Superseded by
the Rust rewrite above.

The clip below is an early geometry and ray tracing stress test: a Utah teapot
loaded as a complex mesh to verify that rays propagate correctly through
non-trivial geometry without getting lost.

<video controls style="max-width:480px;width:100%;display:block;margin:1em auto;">
  <source src="/videos/building3d/teapot.mp4" type="video/mp4">
</video>

## [modestga](https://github.com/krzysztofarendt/modestga) &middot; 2018&ndash;2022

Parallel genetic algorithm with a SciPy-compatible interface, supporting
rectangular bounds and inequality constraints. It runs across all available CPUs
by default, splitting the population into per-CPU subpopulations that exchange
genes after each generation. Features adaptive mutation and is designed for
large-scale non-convex problems. Useful as a drop-in optimizer in simulation and
engineering workflows.

I benchmarked it against Differential Evolution (SciPy) and naive Monte Carlo on
the Rastrigin function. For large-scale problems (N > 32), modestga achieves
similar or better results in significantly shorter time.

![Benchmark: modestga vs. Differential Evolution vs. Monte Carlo](/images/modestga/comparison.png)

*Figure: Comparison of modestga, Differential Evolution (SciPy), and Monte Carlo
on the Rastrigin function. Mean of five runs, population = 100, max 1000 generations.*

## [modest-py](https://github.com/sdu-cfei/modest-py) &middot; 2017&ndash;2022

FMI-compliant parameter estimation for gray-box models in Python. Designed to
work with models developed in Modelica and compiled to FMUs.
[FMI (Functional Mock-up Interface)](https://fmi-standard.org/) is an open
standard for exchanging simulation models as self-contained units called FMUs
(Functional Mock-up Units).

ModestPy supports running multiple optimization algorithms in user-defined
sequences — for example, a global genetic algorithm (GA) followed by a local
gradient-based method — making it easy to handle non-convex cost functions
without committing to a single solver. Whenever GA is used, the tool
automatically generates a parameter evolution plot like the one below.

![Parameter evolution in the genetic algorithm](/images/modestpy/parameter_evolution.png)

*Figure: Parameter evolution across 100 generations of the genetic algorithm,
applied to a gray-box building zone model with 7 estimated parameters. Each dot
is one individual in the population; color encodes training error (NMSE) —
yellow: high error, purple: low error. The population converges from a broad
spread across the search domain toward a narrow, low-error region.*

## [mshoot](https://github.com/sdu-cfei/mshoot) &middot; 2018&ndash;2019

Python framework for Model Predictive Control using the multiple shooting method.
The optimization horizon is divided into N subperiods, each simulated
independently. A nonlinear programming solver then enforces state continuity
between subperiods and minimizes a cumulative cost function subject to state and
input constraints. The framework integrates with FMU-based simulation models,
making it straightforward to apply MPC to building energy systems modeled in
Modelica or other FMI-compliant tools.

![Multiple shooting method diagram](/images/mshoot/multiple_shooting.png)

*Figure: Multiple shooting divides the horizon into N subperiods. State continuity
<span class="nowrap">(x&#8203;<sup>R</sup><sub>k</sub> = x&#8203;<sup>L</sup><sub>k+1</sub>)</span>
is enforced as an NLP constraint.*

## [epquery](https://github.com/sdu-cfei/epquery) &middot; 2017&ndash;2019

Python tool for editing EnergyPlus IDF files programmatically. Simplifies
scripted manipulation of building energy simulation input files. There are now
better tools for this, but when I wrote epquery there was nothing similar available.
