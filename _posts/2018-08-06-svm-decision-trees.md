---
layout: post
title:  "Model selection: Titanic data set"
---

Usually, it's not clear upfront which model type is best for a given problem. Furthermore, many machine learning models rely on different hyperparameters that have to be tuned in order to get satisfactory results. In this post I will compare the performance of several models for the [Titanic](https://www.kaggle.com/c/titanic) data set posted on Kaggle: Decision Tree, Random Forest, k-Nearest Neighbor, and SVM. Although the data set is very small and easy to process, it's a great playground for testing and learning. The original notebook used to produce the results in this post is [here](https://github.com/krzysztofarendt/kaggle-titanic/blob/master/titanic_analysis.ipynb). I used models from [scikit-learn](http://scikit-learn.org).


# Data set

Let's start with a short description of the data set and the task. The task is to predict the survivalibity of the Titanic passengers based on their travel information: ticket class, fare, name, age, sex, family members, cabin, embarkment location and assigned cabin. The learning data set contains 891 entries, however some of them are incomplete (e.g. age is missing in 20% of entries and cabin in 77%).

The data preprocessing procedure adopted in this analysis is as follows:

1. Drop features with too many missing values: cabin
2. Drop features with little influence on the result: ticket number
3. Extract person's title from the name
4. Guess missing values: age based on title, fare based on ticket class
5. Sum columns with family members (SiSp + Parch)
6. Convert all string/categorical variables to discrete numerical (for scikit-learn classifiers)

Let me skip the [code](https://github.com/krzysztofarendt/kaggle-titanic/blob/master/titanic_analysis.ipynb), and simply present some highlights regarding the available data.


![Median age vs. title](/gfx/titanic/median_age_vs_title.png)

![Median fare vs. class](/gfx/titanic/median_fare_vs_class.png)

The few first lines of the pre-processed data set is as follows:

PassengerId | Survived | Pclass | Sex | Age | Fare   | Embarked | Title | Family
------------|----------|--------|-----|-----|--------|----------|-------|--------
1           | 0        | 3      | 1   | 22.0| 7.2500 |3         | 4     | 1
2           | 1        | 1      | 2   | 38.0| 71.283 |1         | 0     | 1
3           | 1        | 3      | 2   | 26.0| 7.9250 |3         | 1     | 0
4           | 1        | 1      | 2   | 35.0| 53.100 |3         | 0     | 1
5           | 0        | 3      | 1   | 35.0| 8.0500 |3         | 4     | 0

# Decision tree vs. Random Forest

First, let's compare a vanilla Decision Tree with a vanilla Random Forest. Both models are great in terms of how easy it is to use them, because there is very little tuning required.

![Random Forest tuning](/gfx/titanic/random_forest_tuning.png)

![Decision Tree vs. Random Forest](/gfx/titanic/decision_tree_vs_random_forest.png)

![k-NN](/gfx/titanic/knn.png)

![SVM tuning](/gfx/titanic/svm_tuning.png)

![SVM features](/gfx/titanic/svm_features.png)