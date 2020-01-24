import React from "react";
import { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Enzyme from "enzyme";
Enzyme.configure({ adapter: new Adapter() });
import TitleForm from "../Components/Cells/TitleForm";

describe("test Notebook component", () => {
  let wrapper;
  let callback;

  beforeEach(() => {
    callback = jest.fn();
    wrapper = shallow(<TitleForm onTitleSubmit={callback} />);
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("initial state has no title", () => {
    expect(wrapper.state().title).toBe(undefined);
  });

  it("sets default title on submit if not title is provided", () => {
    wrapper.instance().handleSubmitClick();
    expect(wrapper.state().title).toBe("My Notebook");
  });

  it("updates the state on change", () => {
    wrapper.setState({ title: "old title" });
    wrapper.instance().handleChange({ target: { value: "new title" } });
    expect(wrapper.state().title).toBe("new title");
  });

  it("calls the titleSubmit method onSubmit", () => {
    wrapper.instance().handleSubmitClick();
    expect(callback.mock.calls.length).toBe(1);
  });
});
