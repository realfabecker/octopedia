import "./App.css";

import { useContext } from "react";
import { Card, Col, Row, Stack, Form } from "react-bootstrap";

import { FilterBy, FilterN, PeriodBy } from "./lib";
import { PullsContext, PullsProvider } from "./context/PullsContext.tsx";

const PullGrid = () => {
  const { prData: data } = useContext(PullsContext);
  return (
    <div id="pulls" className={"container"}>
      {(data?.data?.items || []).map((pr: any) => (
        <Card className="item" key={pr.id}>
          <Card.Body>
            <Stack gap={1}>
              <a href={pr.html_url} target="_blank">
                <p>
                  Pull Number: #{pr.number} ({pr.state})
                </p>
              </a>
            </Stack>

            <Stack gap={1}>
              <p>Created By:</p>
              <p style={{ fontSize: "1.2rem" }}>{pr.created_by}</p>
            </Stack>

            <Stack gap={1}>
              <p>Created At:</p>
              <p style={{ fontSize: "1.2rem" }}>
                {new Date(pr.created_at).toISOString().slice(0, 10)}
              </p>
            </Stack>

            <Stack gap={1}>
              <p>Reviewers:</p>
              <ul style={{ fontSize: "1.2rem" }}>
                {pr.reviewers.split(",").map((r: never) => (
                  <li id={r}>{r}</li>
                ))}
              </ul>
            </Stack>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

const Header = () => {
  const { onChangeFilterName, onChangeFilterValue, filterName } =
    useContext(PullsContext);

  return (
    <header className={"container"}>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="filterName">
            <Form.Label>Filter By</Form.Label>
            <Form.Select
              defaultValue={filterName}
              onChange={(e) => onChangeFilterName(e.target.value as FilterBy)}
            >
              <option value={FilterBy.REVIEWER}>Reviewer</option>
              <option value={FilterBy.CREATED_BY}>Created By</option>
              <option value={FilterBy.CREATED_AT}>Created At</option>
              <option value={FilterBy.UPDATED_AT}>Updated At</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="filterVal">
            <Form.Label>{FilterN[filterName]}</Form.Label>

            {([FilterBy.CREATED_AT, FilterBy.UPDATED_AT].includes(
              filterName,
            ) && (
              <Form.Select
                defaultValue={"choose"}
                onChange={(e) =>
                  onChangeFilterValue(e.target.value as PeriodBy)
                }
              >
                <option value={"choose"}>Choose...</option>
                <option value={PeriodBy.TODAY}>Today</option>
                <option value={PeriodBy.WEEK}>Week</option>
                <option value={PeriodBy.MONTH}>Month</option>
              </Form.Select>
            )) || (
              <Form.Control
                onChange={(e) => onChangeFilterValue(e.target.value)}
              />
            )}
          </Form.Group>
        </Row>
      </Form>
    </header>
  );
};

function App() {
  return (
    <PullsProvider>
      <div id="app">
        <Header />
        <main>
          <PullGrid />
        </main>
        <footer />
      </div>
    </PullsProvider>
  );
}

export default App;
