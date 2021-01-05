//Code by Jack Gao
//C++ code for segment tree implementing lazy propagation

#include <bits/stdc++.h>

using namespace std;

const int max_size = 5001;
int n, arr[max_size], tree[max_size], lazy[max_size];

int constructST(int l, int r, int pos){
  if(l > r)return 0;
  if(l == r){
    tree[pos] = arr[l];
    return arr[l];
  }
  int mid = (l + r)/2;
  tree[pos] = constructST(l, mid, pos * 2 + 1) + constructST(mid + 1, r, pos * 2 + 2);
  return tree[pos];
}

int getSum(int pos, int nodeL, int nodeR, int l, int r){
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
  int mid = (nodeL + nodeR)/2;
  return getSum(2 * pos + 1, nodeL, mid, l, r) + getSum(2 * pos + 2, mid + 1, nodeR, l, r);
}

void updateRange(int pos, int nodeL, int nodeR, int l, int r, int diff){
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
  int mid = (nodeL + nodeR)/2;
  updateRange(2 * pos + 1, nodeL, mid, l, r, diff);
  updateRange(2 * pos + 2, mid + 1, nodeR, l, r, diff);
  tree[pos] = tree[2 * pos + 1] + tree[2 * pos + 2];
  return;
}

int main() {
  cin >> n;
  for(int i = 0; i < n; i++)cin >> arr[i];
  memset(tree, INT_MIN, sizeof(tree));
  memset(lazy, 0, sizeof(lazy));
  cout << endl << "Sum of all elements of the set: " << constructST(0, n - 1, 0) << endl;
  cout << endl << "ORIGINAL Segment Tree: " << endl;
  int tree_size = (int)(pow(2, (int)(ceil(log2(n))) + 1)) - 1;
  for(int i = 0; i < tree_size; i++)cout << tree[i] << ' ';
  cout << endl << endl;
  //get queries
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
      int l, r, val;
      cin >> val >> l >> r;
      l--;
      r--;
      updateRange(0, 0, n - 1, l, r, val);
     /*don't do this cuz of lazy
      cout << endl << "NEW Segment Tree: " << endl;
      for(int i = 0; i < tree_size; i++)cout << tree[i] << ' ';
      cout << endl << endl;
      */
      cout << endl << endl;
    }
  }
  cout << endl << "FINAL Segment Tree: " << endl;
  for(int i = 0; i < tree_size; i++)cout << tree[i] << ' ';
}
