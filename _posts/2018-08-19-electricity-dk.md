---
layout: post
title: "Electricity consumption in Denmark"
published: true
tags: R, ggplot2, visualization
---

* Data source [www.energidataservice.dk](https://www.energidataservice.dk/da_DK/dataset/communityconsumption/resource_extract/9d4159d3-755b-4fcb-98e2-1c727ba5638b)
* Municipality surface areas and populations based on [Wikipedia](https://en.wikipedia.org/wiki/List_of_municipalities_of_Denmark)
* Maps generated using [mapDK](https://github.com/sebastianbarfort/mapDK)
* Scatter and line plots generated using [ggplot2](https://ggplot2.tidyverse.org/)

![Consumption per municipality](/gfx/electricity-dk/map_con_per_muni.png)
**Fig. 1:** Mean electricity consumption per municipality

![Consumption per capita](/gfx/electricity-dk/map_con_per_capita.png)
**Fig. 2:** Mean electricity consumption per capita

![Consumption in time](/gfx/electricity-dk/consumption_vs_time.png)
**Fig. 3:** Mean electricity consumption per municipality (polynomial fit, shaded area - 95% confidence interval)

![Consumption vs population](/gfx/electricity-dk/avg_consumption_vs_population.png)
**Fig. 4:** Mean electricity consumption vs. municipality population (linear fit, shaded area - 95% confidence interval)

![Consumption vs population](/gfx/electricity-dk/avg_consumption_vs_area.png)
**Fig. 5:** Mean electricity consumption vs. municipality area

![Consumption vs population](/gfx/electricity-dk/avg_consumption_per_area_vs_area.png)
**Fig. 6:** Mean electricity consumption per area vs. municipality area

