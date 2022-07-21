const state = {}

/**
 * @api public
 * */


function testHookFunc(val) {
	var hook = {
	  memoizedState: 0, // our initial state
	  baseState: 0, // our initial state
	  queue: {
	    last: null,
	    lastRenderedState: 0, // our initial state
	  },
	  baseUpdate: null,
	  next: null,
	}

	hook.memoizedState = val
	const dispatch = (newState) => {
		hook.memoizedState = newState
		console.log(hook)
	}

	return [hook.memoizedState, dispatch]
}

const [count, setCount] = testHookFunc(5)

console.log(count)

setCount(10)

console.log(count)

class ListNode {
    constructor(data) {
        this.data = data
        this.next = null                
    }
}

class LinkedList {
    constructor(head = null) {
        this.head = head
    }
}

let node1 = new ListNode(2)
let node2 = new ListNode(5)
node1.next = node2

let list = new LinkedList(node1)

console.log(list) //returns 5