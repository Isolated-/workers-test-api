## Usage

Send a request to `https://workers-test-api.xgsd.io/json`.

### POST

Send `convert` in the body:

```json
{
  "convert": "{\"name\": \"my string\"}"
}
```

Or:

```json
{
  "convert": {
    "my": "object"
  }
}
```

### Others

Send `convert` as a query param:

```text
https://workers-test-api.xgsd.io/json?convert={"name":"my string"}
```
