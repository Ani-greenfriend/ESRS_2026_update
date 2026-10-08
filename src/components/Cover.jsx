import Planes from "./Planes.jsx";
import { RULES_DATE } from "../lib/constants.js";

export default function Cover() {
  return (
    <div className="cover">
      <Planes />
      <header className="wrap top">
        <div className="brand">greenfriend.</div>
        <h1>The revised ESRS, in five minutes</h1>
        <p className="lede">Here is what changed, who has to report and when, and which route to take for FY2026. Check your own company as we go.</p>
        <div className="alert" role="note">
          <span>The revised ESRS apply from <b>10 Nov 2026</b>. Reporting on 2026? Choose your route now.</span>
          <a href="#fy2026">Choose your route</a>
        </div>
        <div className="stamp">
          <span>Omnibus I · Directive (EU) 2026/470</span>
          <span>Revised ESRS · Reg. (EU) 2026/1563</span>
          <span>Status {RULES_DATE}</span>
        </div>
        <p className="lede" style={{ fontSize: ".85rem" }}>Independent tool by greenfriend. Not affiliated with EFRAG or the European Commission.</p>
      </header>
    </div>
  );
}
