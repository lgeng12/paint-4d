function save() {
  var filename = prompt("Enter filename");
  if (filename != null) {
    $.get("db/save?filename=" + filename, function(data) {
      alert("Success!");
    });
  }
}

function load() {
  $.get("db/list", function(files) {
    $("#loadfilemodal").innerHTML = "";
    for (var file in files) {
      $("#loadfilemodal").innerHTML += 
        <a></a>
    }
    $("#loadfilemodal").modal("show");
    // $.get("db/load?filename=" + filename, function(packet) {
    //   for (let other_client_id in packet) {
    //     if (clientData[other_client_id] == undefined)
    //       clientData[other_client_id] = {};
    //     clientData[other_client_id] = Object.assign(
    //       {},
    //       clientData[other_client_id],
    //       packet[other_client_id]
    //     );
    //     updateAllLines(packet[other_client_id]);
    //   }
    // });
  });
}
