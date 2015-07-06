Feature: Profile

  @wip
  Background:
    Given Home page

    Then I see sign in form
    When I type username "test"
    When I type password "test"
    And click on log in button
    And I see task board

  Scenario: Update Profile

    Then I click my profile link
    Then I see my profile form

    Then I see first name "Andy" in form
    And I see last name "Garcia" in form
    And I see email "mailtotesthere@gmail.com" in form

    Then I type first name "Antonio" in form
    And I type last name "Banderas" in form
    Then I type email "antonio_banderas@mail.com" in form

    Then I save my profile form
    Then I reload page

    Then I see first name "Antonio" in form
    And I see last name "Banderas" in form
    And I see email "antonio_banderas@mail.com" in form



