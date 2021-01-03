/*
programmed by Jack Gao, 2020
	 /|		   ___-------------___
	 ||	  	/                   \   /----
	 ||	  	|___________________ |\/
	 ||		  |  *            *    |/\
	 ||	  	|--------------------|  \  ***
	 ||	  	\___________________/       |
  _||_     	  |     \ \/ /     |      |
  (E)---------|      \ \/      |------|
	 ||         |       \ \      |
	 ||         |--------\ \-----|
	 || 		    |       /  \     |
	^^ 	        |______/____\____|				
		      		  /            \ 
				       /              \
			       _/                \_
NC INC 2020
*/


var max_size = 5001;
var n, arr = [], tree = [], lazy = [], numLayers, tree_size;
form1 = document.getElementById("form");

var leafColour, nodeColour, lazyColour, white;
leafColour = "#068888";
nodeColour = "#273B3B";
lazyColour = "#ED7A1C";
white = "#ffffff";
cv=document.getElementById("segTree");
cx=cv.getContext("2d");
var margin = 50;
var width = cv.width, height = cv.height;
width -= 2*margin;
height -= 2*margin;
var rowR = [50, 40, 32, 26, 22];
var vDist, hDist = [];
const intmin = -999999;

for(var i = 0; i < max_size; i++){
  tree[i] = intmin;
  lazy[i] = 0;
}
function constructST(l, r, pos){
  if(l > r)return 0;
  if(l == r){
    tree[pos] = arr[l];
    return arr[l];
  }
  var mid = Math.floor((l + r)/2);
  tree[pos] = constructST(l, mid, pos * 2 + 1) + constructST(mid + 1, r, pos * 2 + 2);
  return tree[pos];
}
function getSum(pos, nodeL, nodeR, l, r){
  //check for lazy updates
  if(lazy[pos] != 0){
    tree[pos] += (nodeR - nodeL + 1) * lazy[pos];
    if(nodeL != nodeR){
      lazy[2 * pos + 1] += lazy[pos];
      lazy[2 * pos + 2] += lazy[pos];
    }
    lazy[pos] = 0;
  }
  if(l > r || nodeL > r || nodeR < l)return 0;
  if(nodeL >= l && nodeR <= r){
    //completely inside range 
    return tree[pos];
  }
  var mid = Math.floor((nodeL + nodeR)/2);
  return getSum(2 * pos + 1, nodeL, mid, l, r) + getSum(2 * pos + 2, mid + 1, nodeR, l, r);
}
function updateRange(pos, nodeL, nodeR, l, r, diff){
  //lazy propogation
  if(lazy[pos] != 0){
    tree[pos] += (nodeR - nodeL + 1) * lazy[pos];
    if(nodeL != nodeR){
      lazy[2 * pos + 1] += lazy[pos];
      lazy[2 * pos + 2] += lazy[pos];
    }
    lazy[pos] = 0;
  }
  if(l > r || nodeL > r || nodeR < l)return;
  if(nodeL >= l && nodeR <= r){
    tree[pos] += (nodeR - nodeL + 1) * diff;
    if(nodeL != nodeR){
      lazy[2 * pos + 1] += diff;
      lazy[2 * pos + 2] += diff;
    }
    return;
  }
  //not completely contained
  var mid = Math.floor((nodeL + nodeR)/2);
  updateRange(2 * pos + 1, nodeL, mid, l, r, diff);
  updateRange(2 * pos + 2, mid + 1, nodeR, l, r, diff);
  tree[pos] = tree[2 * pos + 1] + tree[2 * pos + 2];
  return;
}

function total(){
  var total = 0;
  for(var i = 0; i < numLayers; i++)total += rowR[i];
  return total;
}

function drawTree(l, r, pos, layerNum, x, y){
  if(pos == 0){
    cx.beginPath();
    cx.fillStyle = white;
    cx.fillRect(0, 0, width + 2*margin, height + 2*margin);
    cx.lineWidth = 4;
  }
  if(l > r)return;
  if(l == r){
    //leaf node
    var rowPos = pos + 1 - Math.floor(Math.pow(2, layerNum));
    console.log("L: " + l + " R: " + r + " pos: " + pos + " layer: " + layerNum + " layerPos: " + rowPos); 
    //draw
    cx.font = "17px Consolas";
    cx.fillStyle = leafColour;
    cx.fillText(tree[pos], x, y + 13);
    cx.font = "13px Consolas";
    cx.fillText("(" + (rowPos + 1) + ")", x + 17, y + 26);
    cx.strokeStyle = nodeColour;
    //done drawing
    return;
  }
  var mid = Math.floor((l + r)/2);
  //draw tree edge(s)
  cx.fillStyle = "#000000";
  var diff = Math.pow(2, (numLayers - layerNum))/3;
  if(2 * pos + 1 < tree_size && tree[2 * pos + 1] != intmin){
    //draw left edge
    console.log("left edge from " + pos + " to " + (2 * pos + 1) + " drawn.");
    console.log("(" + x + ", " + y + "), (" + (x - Math.floor(hDist/2)*diff) + ", " + (y + vDist) + ")");
    cx.moveTo(x, y);
    cx.lineTo(x - Math.floor(hDist/2)*diff, y + vDist);
  }
  if(2 * pos + 2 < tree_size && tree[2 * pos + 2] != intmin){
    //draw right edge
    console.log("right edge from " + pos + " to " + (2 * pos + 2) + " drawn.");
    console.log("(" + x + ", " + y + "), (" + (x + Math.floor(hDist/2)*diff) + ", " + (y + vDist) + ")");
    cx.moveTo(x, y);
    cx.lineTo(x + Math.floor(hDist/2)*diff, y + vDist);
  }
  cx.stroke();
  //draw the tree node
  if(lazy[pos] != 0)cx.fillStyle = lazyColour;
  else cx.fillStyle = nodeColour;
  //draw the tree node
  cx.font = "17px Consolas";
  cx.fillText(tree[pos], x, y);
  cx.strokeStyle = nodeColour;
  y += 13;
  drawTree(l, mid, pos * 2 + 1, layerNum + 1, (x - Math.floor(hDist/2)*diff), y + vDist);
  drawTree(mid + 1, r, pos * 2 + 2, layerNum + 1, (x + Math.floor(hDist/2)*diff), y + vDist);
  return;
}

function draw(l, r){
  drawTree(0, n - 1, 0, 0, Math.floor(width/2) + margin, margin, 0, n - 1);
  cx.font = "26px Consolas";
  cx.strokeStyle = nodeColour;
  cx.fillText("Sum of elements from " + l + " to " + r + ": " + getSum(0, 0, n-1, l-1, r-1), margin, height + margin);
}

function handleQuery(event){
  console.log("Event!");
  var cmd = document.getElementById("query").value;
  console.log(cmd);
  var l = document.getElementById("leftVal").value, r = document.getElementById("rightVal").value;
  console.log(l + " " + r);
  var diff = document.getElementById("updateVal").value;
  if(cmd === "query"){
    if(l < 1 || r > n){
      document.getElementById("query").value = "Please enter a valid range.";
    }else{
      //fine
      draw(l, r);
    }
  }else if(cmd === "update"){
    if(l < 1 || r > n){
      document.getElementById("query").value = "Please enter a valid range.";
    }else if(diff < 0 || diff > 50){
      document.getElementById("query").value = "Please enter a valid update value.";
    }else{
      //fine
      updateRange(0, 0, n - 1, l - 1, r - 1, diff);
      draw(l, r);
    }
  }else{
    document.getElementById("query").value = "Please enter a valid command.";
  }
  return;
}

//actual code
function updateValues(event){
  var newN = document.getElementById("numberSize").value;
  console.log(newN);
  var newNums = document.getElementById("numbers").value;
  console.log(newNums);
  nums = []
  var lastPos = 0;
  var k = 0;
  while(newNums.indexOf('_', lastPos) != -1){
    var pos = newNums.indexOf('_', lastPos);
    var num = newNums.slice(lastPos, pos);
    num = parseInt(num, 10);
    nums[k] = num;
    if(num < 0 || num > 50){
      //error
      document.getElementById("numbers").value = "Enter numbers between 0 and 50 please.";
    }
    k++;
    lastPos = pos;
    while(newNums[lastPos] === '_')lastPos++;
  }
  if(nums.length != newN){
    //see if there was any last value
    var num = parseInt(newNums.slice(lastPos, newNums.length));
    nums[k] = num;
    if(num < 0 || num > 50){
      //error
      document.getElementById("numbers").value = "Enter numbers between 0 and 50 please.";
    }
  }
  n = newN;
  arr = nums;
  if(arr.length == n){
    //works
    console.log(arr);
    console.log(n);
    console.log("Sum of all elements of the set: " + constructST(0, n - 1, 0));
    tree_size = Math.pow(2, Math.ceil(Math.log2(n)) + 1) - 1;
    console.log("tree size: " + tree_size);
    numLayers = Math.ceil(Math.log2(n)) + 1;
    vDist = Math.floor((height - total())/(numLayers - 1));
    hDist = Math.floor((width - Math.floor(Math.pow(2, numLayers - 1))*rowR[numLayers - 1])/(Math.floor(Math.pow(2, numLayers - 1)) - 1));
    maxLayerNodes = Math.pow(2, Math.ceil(Math.log2(n)));
    console.log("number of layers: " + numLayers);
    console.log("max nodes in bottom layer: " + maxLayerNodes); 
    console.log("ORIGINAL Segment Tree: ");
    for(var i = 0; i < tree_size; i++)console.log(tree[i]);
    //draw the tree
    draw(1, n);
    //delete the form and replace with query form
    form1.innerHTML = '';
    //add new form
    form1.removeEventListener("submit", updateValues);
    var l1 = document.createElement("LABEL");
    var t1 = document.createTextNode("type 'query' or 'update' as your command:");
    l1.appendChild(t1);
    l1.setAttribute("for", "query");
    form1.appendChild(l1);
    var tb1 = document.createElement("INPUT");
    tb1.setAttribute("type", "text");
    tb1.setAttribute("id", "query");
    tb1.setAttribute("required", "");
    tb1.value = "query";
    form1.appendChild(tb1);
    form1.appendChild(document.createElement("BR"));
    var l2 = document.createElement("LABEL");
    var t2 = document.createTextNode("Enter left index: ");
    l2.appendChild(t2);
    l2.setAttribute("for", "leftVal");
    form1.appendChild(l2);
    var inp1 = document.createElement("INPUT");
    inp1.setAttribute("type", "number");
    inp1.setAttribute("id", "leftVal");
    inp1.setAttribute("required", "");
    inp1.value = 1;
    form1.appendChild(inp1);
    form1.appendChild(document.createElement("BR"));
    var l3 = document.createElement("LABEL");
    var t3 = document.createTextNode("Enter right index: ");
    l3.appendChild(t3);
    l3.setAttribute("for", "rightVal");
    form1.appendChild(l3);
    var inp2 = document.createElement("INPUT");
    inp2.setAttribute("type", "number");
    inp2.setAttribute("id", "rightVal");
    inp2.setAttribute("required", "");
    inp2.value = n;
    form1.appendChild(inp2);
    form1.appendChild(document.createElement("BR"));
    var l4 = document.createElement("LABEL");
    var t4 = document.createTextNode("Enter update value (update only) between [0, 50]:");
    l4.appendChild(t4);
    l4.setAttribute("for", "updateVal");
    form1.appendChild(l4);
    var inp3 = document.createElement("INPUT");
    inp3.setAttribute("type", "number");
    inp3.setAttribute("id", "updateVal");
    form1.appendChild(inp3);
    form1.appendChild(document.createElement("BR"));
    submitB = document.createElement("BUTTON");
    submitB.setAttribute("type", "submit");
    submitB.appendChild(document.createTextNode("Submit"));
    form1.appendChild(submitB);
    if(form1)form1.addEventListener('submit', handleQuery);
  }else{
    document.getElementById("numbers").value = "invalid number array! enter the correct amount of values in the correct format.";
    //document.getElementById("numberSize").value = 4;
  }
  //main program
  return;
}
//get user input
if(form1)form1.addEventListener('submit', updateValues);

//get queries
/*
cout << "Please enter your queries; ('Q', l, r) for sum query and ('U', val, l, r)  for range update ('X' to quit" << endl << endl;
while(true){
  char c;
  cin >> c;
  if(c == 'X')break;
  if(c == 'Q'){
    int l, r;
    cin >> l >> r;
    l--; r--;
    cout << endl << "Sum from " << l + 1 << " to " << r + 1 << ": " << getSum(0, 0, n - 1, l, r) << endl << endl;
  }else{
    var l, r, val;
    //get these values
    l--;
    r--;
    updateRange(0, 0, n - 1, l, r, val);
  }
}
*/




