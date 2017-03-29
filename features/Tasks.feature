Feature: Tasks

  Check Tasks After On Close Event In Task Edit - when we decided to update task from tasks, we added some info but then we clicked by 'Close'.We shouldn't
  see changes in current task from tasks

  Check tree board - when we update task from tree board, after saving changes, we need to stay on tree view and see changes

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

  Scenario: Check tree board

    Then I click on "Tree" filter  button
    And I see tree view
    Then I see task "task 1" spent time "0"
    Then I see task "task 1.1.1" spent time "0"
    Then I click on edit button of task "task 1.1.1"
    And I click task spent time "+30"
    Then I see humanized spent time "00:30"
    And I click on save button
    Then I see tree view
    And I see task "task 1" spent time "0.5"
    And I see task "task 1.1.1" spent time "0.5"

  Scenario: Check Tasks on different taskId routes (check description, metrics)

    Then I click on task link "task 1"
    And I see parent task "task 1"

    Then I click on task link "task 1.2"
    And I see parent task "task 1.2"

    Then I see estimated time "2" of parent task
    And I see spent time "0" of parent task
    Then I see todo time "2" of parent task
    Then I see complexity "1" of parent task
    Then I see points "2p" of parent task

    Then I click on parent task metrics to edit it
    Then I type description "123456"
    And I click on save button

    Then I sleep 1

    Then I see parent task description "123456" for task "task 1.2"

    Then I sleep 1

    Then I click back button to parent task "task 1"

    Then I click on task link "task 1.1"
    And I see parent task "task 1.1"
    Then I don't see parent task description "123456" for task "task 1.1"

    Then I see estimated time "1" of parent task
    And I see spent time "1" of parent task
    Then I see todo time "0" of parent task
    Then I see points "1p" of parent task

  Scenario: Check cancel function when add new task on task page where no other sub tasks

    Then I click on task link "task 1"
    And I see parent task "task 1"

    Then I click on task link "task 1.2"
    And I see parent task "task 1.2"

    #no tasks yet
    Then I don't see tasks in board

    And I see task title input
    When I type task title "newTask"

    Then I type description "newDescription"

    And I click on task complexity "2+"
    And I click task spent time "+30"
    And I click task spent time "+30"
    Then I see humanized spent time "01:00"

    Then I click on close button

    #still no tasks yet
    Then I don't see tasks in board
