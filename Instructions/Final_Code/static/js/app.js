
function createPlot(id) {
    
    // Reading in JSON data from Local Server
    d3.json("samples.json").then((data)=> {

        var washFreq = data.metadata.map(d => d.wfreq)
        
        // Filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        console.log(samples);
  
        // Getting the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // Top 10 otu ids for plot OTU and reversing it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // Get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
        // Top 10 labels for the plot
        var labels = samples.otu_labels.slice(0, 10);
  
        // Create trace variable for the plot
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(142,124,195)'},
            type:"bar",
            orientation: "h",
        };
  
        // Data variable
        var data = [trace];
  
        // Create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // Bar plot
        Plotly.newPlot("bar", data, layout);
      
        // Beginning Bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
        };
  
        //Layout for the bubble plot
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // Creating data variable 
        var data1 = [trace1];
  
        // Bubble plot
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // Gauge chart
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(washFreq),
          title: { text: ` Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "red" },
                    { range: [2, 4], color: "yellow" },
                    { range: [4, 6], color: "teal" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "green" },
                  ]}
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  


// Create function to get the necessary data
function getData(id) {
    // read the json file to get data
    d3.json("samples.json").then((data)=> {
        
        // get the metadata info for the demographic panel
        var metadata = data.metadata
        console.log(metadata)

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// create the function for the change event
function optionChanged(id) {
    createPlot(id);
    getData(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // call the functions to display the data and the plots to the page
        createPlot(data.names[0]);
        getData(data.names[0]);
    });
}

init();