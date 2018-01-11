*** Settings ***
Library         REST                            localhost:8273
Suite setup     Set headers and assume schema   ${CURDIR}/headers.json
Suite teardown  Rest instances                  results/instances.json

*** Keywords ***
Set headers and assume schema
    [Arguments]         ${headers}
    Set headers         ${headers}
    Expect response     ${CURDIR}/schemas/response_status.json

*** Test Cases ***
Get found
    GET                 /users/1            timeout=3.0
    &{validations}=     Input               ${CURDIR}/validations.json
    Integer             response status     &{validations}
    &{body}             Object              response body
    @{enum_id}=         Input               [1, 3, "4"]
    Integer             response body id    @{enum_id}
    String              response body name  minLength=2
    Output                                  file_path=results/get.json

Get not found
    GET                 /users/100
    Integer             response status     404