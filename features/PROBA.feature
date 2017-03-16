Feature: PROBA

  Check tree board - when we update task from tree board, after saving changes, we need to stay on tree view and see changes

  Background:
    Given Home page

    Then I see sign in form
    When I type username "test"
    When I type password "test"
    And click on log in button
    Then I sleep 1
    And I see task board

  @wip
  Scenario: Check tree board
    
    Then I click on "Tree" filter  button
    And I set max metrics details
    Then I see task "task 1" spent time "0"
    And I see
    Then I see task "task 1.1.1" spent time "0"

