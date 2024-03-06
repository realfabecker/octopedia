import "./App.css";

import { useContext } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Stack,
  Placeholder,
} from "react-bootstrap";

import { FilterBy, FilterN, PeriodBy } from "./lib";
import { PullsContext, PullsProvider } from "./context/PullsContext.tsx";

const BlankCard = ({ sizes }: { sizes: number[] }) => {
  const rand = () =>
    sizes.sort(() => [-1, 0, 1][Math.floor(Math.random() * 3)]).pop();
  return (
    <Card className={"item"} style={{ height: "26.5rem" }}>
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} size={"lg"} />
        </Placeholder>
        <Placeholder animation="glow" style={{ lineHeight: "3rem" }}>
          <Placeholder xs={rand()} />
          <br />
          <Placeholder xs={rand()} />
          <br />
          <Placeholder xs={rand()} />
          <br />
          <Placeholder xs={rand()} />
          <br />
          <Placeholder xs={rand()} />
          <br />
          <Placeholder xs={rand()} />
          <br />
          <Placeholder xs={rand()} />
        </Placeholder>
      </Card.Body>
    </Card>
  );
};

const PullCard = ({ pr }: { pr: any }) => {
  const approvals = pr.approvals?.split(",") || [];

  return (
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
              <li key={r + Math.random() + ""}>
                {r}
                {approvals.includes(r) && (
                  <span
                    style={{ fontSize: "2rem", color: "green" }}
                  >{`\u2713`}</span>
                )}
              </li>
            ))}
          </ul>
        </Stack>
      </Card.Body>
    </Card>
  );
};

const PullGrid = () => {
  const { data, handleClickNextPage } = useContext(PullsContext);

  const getBlankCardsLen = () => {
    if (window.innerWidth > 1000) {
      return 3 - (data.data.length % 3);
    }
    if (window.innerWidth > 700) {
      return 2 - (data.data.length % 2);
    }
    return 1;
  };

  return (
    <>
      <div id="pulls" className={"container"}>
        {(data?.data || []).map((pr: any) => (
          <PullCard pr={pr} key={pr.id} />
        ))}
        {data.loading &&
          Array.from({ length: getBlankCardsLen() }, () => (
            <BlankCard key={Math.random()} sizes={[8, 2, 10, 5, 4, 6, 7]} />
          ))}
      </div>
      {data.more && (
        <Stack className="container">
          <Button
            size="lg"
            style={{ height: "3.8rem" }}
            variant="secondary"
            onClick={handleClickNextPage}
            disabled={data.loading}
          >
            {data.loading ? "Loading..." : "Load more..."}
          </Button>
        </Stack>
      )}
    </>
  );
};

const Header = () => {
  const { onChangeFilterName, onChangeFilterValue, params } =
    useContext(PullsContext);

  return (
    <header className={"container"}>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="filterName">
            <Form.Label>Filter By</Form.Label>
            <Form.Select
              size="lg"
              style={{ height: "4.8rem" }}
              defaultValue={params?.filterBy || FilterBy.CHOOOSE}
              onChange={(e) => onChangeFilterName(e.target.value as FilterBy)}
            >
              <option value={"choose"}>Choose...</option>
              <option value={FilterBy.REVIEWER}>Reviewer</option>
              <option value={FilterBy.CREATED_BY}>Created By</option>
              <option value={FilterBy.CREATED_AT}>Created At</option>
              <option value={FilterBy.UPDATED_AT}>Updated At</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="filterVal">
            <Form.Label>
              {FilterN[params.filterBy || FilterBy.CHOOOSE]}
            </Form.Label>

            {(params.filterBy &&
              [FilterBy.CREATED_AT, FilterBy.UPDATED_AT].includes(
                params.filterBy,
              ) && (
                <Form.Select
                  size="lg"
                  style={{ height: "4.8rem" }}
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
                size="lg"
                style={{ height: "4.8rem" }}
                disabled={params?.filterBy === FilterBy.CHOOOSE}
                onChange={(e) => onChangeFilterValue(e.target.value)}
              />
            )}
          </Form.Group>
        </Row>
      </Form>
    </header>
  );
};

const Footer = () => {
  return <footer></footer>;
};

function App() {
  return (
    <PullsProvider>
      <div id="app">
        <Header />
        <main>
          <PullGrid />
        </main>
        <Footer />
      </div>
    </PullsProvider>
  );
}

export default App;
