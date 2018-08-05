---
layout: page
title: Software
permalink: /software/
---

# ModestPy

A toolbox for parameter estimation in [Functional Mock-up Units](https://fmi-standard.org/). Provides an interface to several optimization algorithms, including gradient-based methods (L-BFGS-B, SLSQP, Truncated Newton), Genetic Algorithm (in-house code), and Generalized Pattern Search (in-house code). Enables to mix the methods in arbitrary sequences.

Project repository: [ModestPy](https://github.com/krzysztofarendt/modest-py)

# EPQuery

EPQuery is a tool for exploring and editing large EnergyPlus models (stored in IDF). The tool helps to automate tedious tasks, like adding new schedules or external interface objects. EPQuery supplies basic methods for querying the model, selecting different objects and perform basic editing, but the user can pass custom functions to be used on the selected objects. A model can be explored using fuzzy queries.

Project repository: [EPQuery](https://github.com/krzysztofarendt/epquery)

# MShoot

Multiple shooting model predictive control (MPC) supporting [scikit-learn](http://scikit-learn.org) models, [FMI](https://fmi-standard.org/)-compliant models, and generic Python models (through abstract base classes).

Project repository: to be released to open source soon

# ModestGA

A rather basic Genetic Algorithm written in Python with a SciPy-like interface.

Project repository: [ModestGA](https://github.com/krzysztofarendt/modestga)
