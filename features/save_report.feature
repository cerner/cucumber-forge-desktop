Feature: Save Report
  <In order to> record or communicate feature documentation
  <As a> user of cucumber-forge-desktop
  <I want> to save HTML reports generated from the feature files

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

  Scenario: Saving an HTML report
    Given the user selects the 'pets/felines' directory with the folder selection button
    And the report is displayed
    And the project title on the sidebar is 'felines'
    When the user clicks the save button
    Then the report will be saved in a file called 'felines.html'

  Scenario: Saving an HTML report that is filtered by a tag
    Given the user enters the value 'feeding' into the filter text box
    And the user selects the 'pets' directory with the folder selection button
    And the report is displayed
    And the report name on the sidebar is 'feeding'
    And the project title on the sidebar is 'pets'
    When the user clicks the save button
    Then the report will be saved in a file called 'feeding_pets.html'
