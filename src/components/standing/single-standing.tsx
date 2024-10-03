import React from "react";
import { INTStanding } from "../../interfaces/standing";

interface SingleStandingProps {
  standing: INTStanding | null;
}

const SingleStanding: React.FC<SingleStandingProps> = ({ standing }) => {
  return (
    <>
      <section className="hero">
        <div className="wrapper">
          <h1>Classements</h1>
        </div>
      </section>
    </>
  );
};

export default SingleStanding;
