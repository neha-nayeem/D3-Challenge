# D3-Challenge: Data Journalism and D3

## Background
This project involves analyzing the current trends shaping people's lives in the United States, as well as creating charts and interactive elements to help readers understand findings.

The data set included with the assignment is based on 2014 ACS 1-year estimates: [https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml](https://factfinder.census.gov/faces/nav/jsf/pages/searchresults.xhtml), and includes data on rates of income, obesity, poverty, etc. by state. MOE stands for "margin of error."

## Dashboard

Bootstrap and custom CSS was used to pretty up the dashboard. 

This can be viewed at: [Health Risks vs. Demographics Dashboard](https://github.com/neha-nayeem/D3-Challenge)

## Core Assignment: D3 Dabbler (Required Assignment)
Using D3, data was pulled in from the `data.csv` and two variables `Healthcare vs. Poverty` were used to create a scatter plot. The following was also completed:

* State abbreviations were included as text labels in the circles.

* Axes and labels were created and situated to the left and bottom of the chart.

## Bonus: Impress the Boss (Optional Assignment)

#### 1. More Data, More Dynamics

For the bonus, more demographics and more risk factors were included on the chart by doing the following:

* Binding all of the CSV data to the circles to easily determine their x or y values when the labels are clicked.

* Placed additional labels in the scatter plot and gave them click events so that users can decide which data to display. 

* Animated the transitions for circles' locations as well as the range of the axes. 

#### 2. Incorporate d3-tip
Another layer of data was added to determine the true value of each data point: **tooltips**! Tooltips were added to the circles to display data that the user has selected. 

For this, the `d3-tip.js` plugin developed by [Justin Palmer](https://github.com/Caged) was used.

