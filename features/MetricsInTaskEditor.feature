Feature: MetricsInTaskEditor

  Background:
    Given Home page

    Then I see sign in form
    When I type username "test"
    When I type password "test"
    And click on log in button
    Then I sleep 1
    And I see task board

  Scenario: Metrics of a very new task

    Then I see task "task 1"
    And I see task "task 2"
    And I see task title input
    When I type task title "p1"
    Then I see task form
    Then I click on save button

    And I see task "p1"
    Then I click on task link "p1"
    Then I am on "p1" page

    And I see task title input
    When I type task title "p1.1"
    Then I see task form
    Then I click task spent time "1h"
#    And I see estimated time "0"
    And I see humanized spent time "01:00"
#    And I see spent time "1"
#    And I see time todo "0"
    Then I click task spent time "30m"
    And I see humanized spent time "01:30"
#    And I see estimated time "0"
#    And I see spent time "2"
    Then I click task spent time "30m"
    And I see humanized spent time "02:00"
#    And I see time todo "0"
    Then I click on task complexity "2+"
    Then I click on task status "Accepted"
    Then I click on save button

    Then I am on "p1" page
    And I see task title input
    When I type task title "p1.2"
    Then I see task form
    Then I click task spent time "30m"
    Then I click on task complexity "3"
    And I see humanized spent time "00:30"
#    And I see estimated time "0"
#    And I see spent time "0.50"
#    And I see time todo "0"
    Then I click on task status "In progress"
    Then I click on save button

  Scenario: Metrics of an edited task

    Then I see task "task 1"
    And I see task "task 2"
    And I see task title input
    When I type task title "p1"
    Then I see task form
    Then I click on save button

    And I see task "p1"
    Then I click on task link "p1"
    Then I am on "p1" page

    And I see task title input
    When I type task title "p1.1"
    Then I see task form
    Then I click task spent time "1h"
    And I see humanized spent time "01:00"
#    And I see estimated time "0"
#    And I see spent time "1"
#    And I see time todo "0"
    Then I click on task complexity "2+"
    Then I click on task status "Accepted"
    Then I click on save button

    Then I am on "p1" page
    And I see task title input
    When I type task title "p1.2"
    Then I see task form
    Then I click task spent time "30m"
    Then I click on task complexity "3"
    And I see humanized spent time "00:30"
#    And I see estimated time "0"
#    And I see spent time "0.50"
#    And I see time todo "0"
    Then I click on task status "In progress"
    Then I click on save button

    Then I am on "p1" page
    Then I click on task link "p1.2"
    Then I am on "p1.2" page
    Then I edit this task in layout
    And I see estimated time "1.63"
    And I see spent time "0.5"
    And I see time todo "1.13"

    Then I click task spent time "1h"
    And I see estimated time "1.63"
    And I see spent time "1.5"
    And I see time todo "0.13"

    Then I click on task complexity "2+"
    And I see estimated time "1"
    And I see spent time "1.5"
    And I see time todo "-0.5"


