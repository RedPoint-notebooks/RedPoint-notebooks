import React from "react";
import ReactDOM from "react-dom";
import { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });
import CellToolbar from "../Components/Shared/CellToolbar";

describe("test CellToolbar component", () => {
  let wrapper;
  let callback;
  beforeEach(() => {
    callback = jest.fn();
    wrapper = shallow(<CellToolbar onDeleteClick={callback} onLanguageChange={callback} onRunClick={callback} />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("props.onDeleteClick is called when the delete button is clicked", () => {
    const button = wrapper.find(".delete-btn").first();
    button.simulate("click");
    expect(callback.mock.calls.length).toBe(1);
  });

  it("props.onRunClick is called when the delete button is clicked", () => {
    const runButton = wrapper.find(".run-or-spin").first();
    runButton.simulate("click");
    expect(callback.mock.calls.length).toBe(1);
  });
  
  // it("props.onLanguageChange is called when the language dropdown is clicked", () => {
  //   const button = wrapper.find(".language-dropdown").first();
  //   button.simulate("click");
  //   expect(callback.mock.calls.length).toBe(1);
  // })

});