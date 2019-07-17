Feature: Generate Report
  <In order to> record or communicate feature documentation
  <As a> user of cucumber-forge-desktop
  <I want> to generate HTML reports directly from the feature files in a directory

  Background:
    Given there is a file named 'pets/dog_care.feature' with the following contents:
      """
      Feature: Dog Care
        <In order to> care for and enjoy my pet
        <As a> dog owner
        <I want> interact with my dog

        Background:
          Given I have a dog

        @feeding
        Scenario: Feeding the Dog
          Given the dog is hungery
          When I give dog food to the dog
          Then the dog will eat it

        @petting
        Scenario Outline: Petting the Dog
          Dog's do not like to be pet in the wrong direction.

          When I pet the dog's hair <direction:>
          Then the dog will <result>

          Examples:
            | direction: | result       |
            | backwards  | lick my hand |
            | forwards   | growl        |
      """
    And there is a file named 'pets/felines/cat_care.feature' with the following contents:
      """
      Feature: Cat Care
        <In order to> care for and enjoy my pet
        <As a> cat owner
        <I want> interact with my cat

        Background:
          Given I have a cat

        @feeding
        Scenario: Feeding the Cat
          Given the cat is hungery
          When I give the following food to the cat:
            | fish  |
            | steak |
          Then the cat will eat it

        @petting
        Scenario Outline: Petting the Cat
          Cat's do not like to be pet in the wrong direction.

          When I pet the cat's hair <direction:>
          Then the cat will hiss

          Examples:
            | direction: |
            | backwards  |
            | forwards   |
      """

  Scenario: Generating an HTML report for the features in a directory and its sub-directories
    Given the current date is {current_date}
    When the user selects the 'pets' directory with the folder selection button
    Then the loading indicator will be displayed
    And a second later the report will be displayed
    And the title on the report will be "pets"
    And the report will contain 2 features
    And the report will contain 4 scenarios

  Scenario Outline: Generating an HTML report filtered by a tag
    Provided tags can include the '@' symbol, but it is not required.

    When the user enters the value <tag:> into the filter text box
    And the user selects the 'pets' directory with the folder selection button
    Then the loading indicator will be displayed
    And a second later the report will be displayed
    And the report will contain 2 features
    And the report will contain 2 scenarios

    Examples:
      | tag:       |
      | 'feeding'  |
      | '@feeding' |

  Scenario Outline: Filtering a report by a tag when the report has already been generated
    Given the user selects the 'pets/felines' directory with the folder selection button
    And the report is displayed
    And the report contains 2 scenarios
    When the user enters the value 'feeding' into the filter text box
    And the user <action:>
    Then the loading indicator will be displayed
    And the report will contain 1 scenario

    Examples:
      | action:                  |
      | clicks the filter button |
      | presses enter            |
  
  Scenario: Saving an HTML report
    Given the user selects the 'pets/felines' directory with the folder selection button
    And the report is displayed
    When the user clicks the save button
    Then the report will be saved in a file called 'felines.html'

  Scenario: Saving an HTML report that is filtered by a tag
    Given the user enters the value 'feeding' into the filter text box
    And the user selects the 'pets' directory with the folder selection button
    And the report is displayed
    When the user clicks the save button
    Then the report will be saved in a file called 'feeding_pets.html'
