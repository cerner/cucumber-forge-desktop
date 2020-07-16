Feature: App Settings
  <In order to> configure my experience with the app
  <As a> user of cucumber-forge-desktop
  <I want> to be able to adjust persistant settings for the app

  Scenario: Toggling the settings view
    Given there is a file named 'pets/dog_care.feature' with the following contents:
      """
      Feature: Dog Care

        Scenario: Feeding the Dog
          Given the dog is hungery
          When I give dog food to the dog
          Then the dog will eat it
      """
    When the user clicks the settings button
    Then the settings view will be displayed
    When the user clicks the settings button
    Then the settings view will be hidden
    When the user clicks the settings button
    Then the settings view will be displayed
    When the user selects the 'pets' directory with the folder selection button
    Then the report will be displayed
    And the settings view will be hidden
    When the user clicks the settings button
    Then the settings view will be displayed
    And the report will be hidden
    When the user clicks the settings button
    And the settings view will be hidden
    Then the report will be displayed

  Scenario: Selecting an alternative Gherkin dialect
    Reports can be generated for features written with alternative Gherkin dialects by selecting
    the proper Default Gherkin Dialect in the Cucumber Forge settings.

    Given there is a file named 'pets/afrikaans.feature' with the following contents:
      """
      Besigheid Behoefte: Hondsorg
        Agtergrond:
          Gegewe Ek het 'n hond

        Situasie: Die hond voed
          Gegewe die hond is honger
          Wanneer I give dog food to the dog
          Dan Ek gee hondekos vir die hond

        Situasie Uiteensetting: Die hondjie klapper
          Wanneer Ek troeteldier van die hond se hare <direction:>
          Dan die hond sal <result>
          Maar die hond sal my nie byt nie
          En die hond sal kalmeer

          Voorbeelde:
            | direction:  | result      |
            | agteruit    | lek my hand |
            | voorspelers | grom        |
      """
    When the user clicks the settings button
    And the user selects 'af' from the Default Gherkin Dialect drop-down menu
    And the user selects the 'pets' directory with the folder selection button
    Then the report will be displayed
    And the report will contain 1 features
    And the report will contain 2 scenarios

  Scenario: Generating an HTML report for a feature file with an alternative Gherkin dialect when the language header is present in the feature
    If there is a language header is present in the feature, that language will be prefered for that file when generating
    report (regarless of the configured Default Gherkin Dialect in the Cucumber Forge setting). This allows for 
    generating reports for a set of feature files written with different Gherkin dialects.

    Given there is a file named 'pets/dog_care.feature' with the following contents:
      """
      Feature: Dog Care

        Scenario: Feeding the Dog
          Given the dog is hungery
          When I give dog food to the dog
          Then the dog will eat it
      """
    And there is a file named 'pets/panjabi.feature' with the following contents:
      """
      # language: pa
      ਨਕਸ਼ ਨੁਹਾਰ: ਕੁੱਤੇ ਦੀ ਦੇਖਭਾਲ
        ਪਿਛੋਕੜ:
          ਜਿਵੇਂ ਕਿ ਮੇਰੇ ਕੋਲ ਇੱਕ ਕੁੱਤਾ ਹੈ

        ਪਟਕਥਾ: ਕੁੱਤੇ ਨੂੰ ਖੁਆਉਣਾ
          ਜੇਕਰ ਕੁੱਤਾ ਭੁੱਖਾ ਹੈ
          ਜਦੋਂ ਮੈਂ ਕੁੱਤੇ ਨੂੰ ਖਾਣਾ ਦਿੰਦਾ ਹਾਂ
          ਤਦ ਕੁੱਤਾ ਇਹ ਖਾਵੇਗਾ

        ਪਟਕਥਾ ਰੂਪ ਰੇਖਾ: ਕੁੱਤਾ ਪਾਲ ਰਹੇ
          ਜਦੋਂ ਮੈਂ ਕੁੱਤੇ ਦੇ ਵਾਲ ਪਾਲਤੂ ਹਾਂ <direction:>
          ਤਦ ਕੁੱਤਾ ਕਰੇਗਾ <result>
          ਪਰ ਕੁੱਤਾ ਮੈਨੂੰ ਨਹੀਂ ਡੰਗੇਗਾ
          ਅਤੇ ਕੁੱਤਾ ਸ਼ਾਂਤ ਹੋ ਜਾਵੇਗਾ

          ਉਦਾਹਰਨਾਂ:
            | direction: | result     |
            | ਪਿੱਛੇ ਵੱਲ     | ਮੇਰਾ ਹੱਥ ਚੱਟੋ |
            | ਅੱਗੇ        | ਫੁੱਟ         |
      """
    When the user clicks the settings button
    And the user selects 'en' from the Default Gherkin Dialect drop-down menu
    And the user selects the 'pets' directory with the folder selection button
    Then the report will be displayed
    And the report will contain 2 features
    And the report will contain 3 scenarios
