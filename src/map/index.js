import React, { useState, useEffect, useReducer } from "react";
import { Input, Upload, Row, Col, Table } from "antd";
import { Radio, Button,  message, Space } from "antd";
import { MoonLoader } from 'react-spinners';
import { css } from '@emotion/react';
import Map from './mapbox';

export default () => {
  const [showDownload, setDownload] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(['cell_id', 'address','bearing']);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('cell_id');
  //const file = xlsx.readFile("./a.xlsx");


  const { TextArea } = Input;
  const [tableData, setTableData] = useState([])

    const [orglines, setOrglines] = useState([]);
    const [lines, setLines] = useState([]);

    const override = css`
    display: block;
    margin: 0 auto;
  `;
 
    const handleLookup = () => {
      //alert(JSON.stringify(lines))
      var result = [];
      setTableData(result);
      setLoading(true);
      setDownload(false)
      fetch("http://10.250.70.184/main/eric/find_node_info/find_loc_map.php?inputtype=" + inputType, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lines)
      })
        .then((response) => response.json())
        .then((data) => {
          //setindata(data);
          //console.log(data)
          var outputArray = [];
          // Loop through the input array and lookup each value in the lookup object
          for (var i = 0; i < lines.length; i++) {
            var value = lines[i];
            // Find the object in the lookup object that matches the current value
            var lookupObjectMatch = data.find(function(obj) {
              return obj.cell_id === value;
            });
            // If a match is found, create a new object with the matched values and add it to the output array
            if (lookupObjectMatch) {
              var newObj = {};
              newObj.cell_id = lookupObjectMatch.cell_id;
              newObj.name = lookupObjectMatch.name;
              newObj.lng = lookupObjectMatch.lng;
              newObj.lat = lookupObjectMatch.lat;
              newObj.arrows = lookupObjectMatch.arrows;
              outputArray.push(newObj);
            }
          }
          setTableData(outputArray)
          setDownload(true)
          setLoading(false);
          //console.log(outputArray)
        });
    };

    const handleTextChange = e => {
      const text = e.target.value;
      var split_text = text.split('\n');
      // Loop through the array and check each element
      if (split_text.length>0) {
        for (let i = 0; i < split_text.length; i++) {
          if (split_text[i].toString().substring(5,6) == '0' && split_text[i].length>=10) {
            split_text[i] = parseInt(split_text[i].substring(9),16);
            if (split_text[i] == '0')
            split_text[i] = "";
          }
          if (split_text[i].toString().substring(5,6) != '0' && split_text[i].length>=10) {
            let zerofilled = '000' + parseInt(split_text[i].substring(10),16).toString();
            split_text[i] = parseInt(split_text[i].substring(5,10),16).toString() + zerofilled.slice(-3);
          }
        }
      }
      setOrglines(split_text); // Split text into lines and remove empty lines
      split_text = split_text.filter(line => line !== ''); // Split text into lines and remove empty lines
      for (var i = 1; i < split_text.length; i++) {
        // Check if the current element is the same as the previous element
        if (split_text[i] == split_text[i-1]) {
          // Remove the current element
          split_text.splice(i, 1);
          // Decrement the loop index to account for the removed element
          i--;
        }
      }
      //const uniqueLines = [...new Set(lines2)]; // Remove duplicate lines using a Set
      //setText(uniqueLines.join('\n')); // Join the unique lines and update the state
      setLines(split_text);
    };

    return (
        <Map mapdata={tableData}/>
  );
};

