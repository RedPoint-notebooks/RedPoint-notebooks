import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });
import Notebook from "../Components/Notebook";
import { isMainThread } from "worker_threads";

describe("test Notebook component", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Notebook />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("initial state has no cell data", () => {
    expect(wrapper.state().cells.length).toBe(0);
  });
});
