import React, { useState, useRef } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

function SubAnnotation() {
  const [subannotations, addSubannotation] = useState([]);
  const newTitle = useRef(null);

  const handleSubmit = e => {
    e.preventDefault();
    const newSubAnnotations = [
      ...subannotations,
      { title: newTitle.current.value, annotation: [] }
    ];
    addSubannotation(newSubAnnotations);
    newTitle.current.value = "";
  };
  return (
    <>
      <SetVisulations />
      <Tabs>
        <TabList>
          {subannotations.map(annotation => (
            <Tab>{annotation.title}</Tab>
          ))}
          <Tab>
            <form class="form-inline" onSubmit={handleSubmit}>
              <input
                type="text"
                class="form-control form-control-sm"
                id="formGroupExampleInput2"
                placeholder="Add Sub-annotation"
                ref={newTitle}
              />
            </form>
          </Tab>
        </TabList>

        <TabPanel></TabPanel>
        <TabPanel></TabPanel>
      </Tabs>
    </>
  );
}

function SetVisulations() {
  return <>Visualization Here</>;
}
export default SubAnnotation;
