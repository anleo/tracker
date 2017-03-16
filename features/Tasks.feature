Feature: Tasks

  Check Tasks After On Close Event In Task Edit - when we decided to update task from tasks, we added some info but then we clicked by 'Close'.We shouldn't
  see changes in current task from tasks

  Background:
    Given Home page

    Then I see sign in form
    When I type username "test"
    When I type password "test"
    And click on log in button
    Then I sleep 1
    And I see task board
    And I set max metrics details

  Scenario: Check Tasks After On Close Event In Task Edit

    Then I click on task link "task 1"
    And I see task "task 1"
    And I see task "task 1.2" in "New" column
    And I see task "task 1.2" complexity "1"
    And I see task "task 1.2" spent time "0"
    Then I click on edit button of task "task 1.2"
    Then I type description "123"
    And I click on save button
    Then I see description "123" for task "task 1.2"
    Then I click on edit button of task "task 1.2"
    And I click on task complexity "2+"
    And I click task spent time "+30"
    And I click task spent time "+30"
    Then I see humanized spent time "01:00"
    Then I type description "123456"
    Then I click on close button
    And I see task "task 1.2" in "New" column
    Then I see task "task 1.2" complexity "1"
    And I see task "task 1.2" spent time "0"
    And I don't see description "123456" for task "task 1.2"
