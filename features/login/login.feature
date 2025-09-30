Feature: Login Functionality

  As a user
  I want to be able to login to the application
  So that I can access my account

  Background:
    Given I am on the login page

  @login @negative
  Scenario: Login with invalid credentials
    When I login with username "invaliduser" and password "wrongpass"
  #   Then I should see an error message

  # @login @negative
  # Scenario: Login with empty username
  #   When I enter username ""
  #   And I enter password "password123"
  #   And I click the login button
  #   Then I should see an error message

  # @login @negative
  # Scenario: Login with empty password
  #   When I enter username "testuser"
  #   And I enter password ""
  #   And I click the login button
  #   Then I should see an error message

