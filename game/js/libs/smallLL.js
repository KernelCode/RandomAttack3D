function Node(data){
	this.next=null;
	this.data=data;
	this.pre=null;

}
function LL(){
	this.length=0;
	this.root=null;
	this.lastNode=null;
	this.startLOOp=null;
	this.getIndex=function(id){
		node=this.root;
		while(node!=null){
			if(node.data.index==id){
				return node.data;
			}
		}
		return null;
	}
	this.loop=function(){
		this.startLOOp=this.root;
	}
	this.next=function(){
		if(this.startLOOp!=null){
			var temp=this.startLOOp;
			this.startLOOp=this.startLOOp.next;
			return temp;
		}
		else
			return null;
	}
	this.addNode =function (data){
		var node = new Node(data);

		if(this.root==null){
			this.root=node;
			this.lastNode=this.root;
		}else{
			node.pre=this.lastNode;
			this.lastNode.next=node;
			this.lastNode=node;
		}
		this.length++;

	}
	this.removeOutRange=function(){
		var node = this.root;
		if(node==null){
			return null;
		}else{
			while(node!=null){
				if(node.data.IsOutRang){
					var nextNODE=null;
					if(node.next!=null)
						nextNODE=node.next;
					if(node==this.root){

						this.root=this.root.next;
						if(this.root!=null)
							this.root.pre=null;	
						
					}
					if(node==this.lastNode){
						this.lastNode.pre.next=null;
						this.lastNode=this.lastNode.pre;
						
					}
					if(node.pre!=null){
						node.pre.next=node.next;
					}

					if(node.next!=null){
						node.next.pre=node.pre;
					}
					
					node.next=null;
					node.pre=null;
					node=null;
					this.length--;
					node=nextNODE;
				}else{
					node=node.next;
				}
			}
		}
	}
	this.removeNode = function (data){
		var node = this.root;
		if(node==null){
			return null;
		}else{
			while(node!=null){
				if(node.data==data){
					if(node.data==this.root.data){

						this.root=this.root.next;
						if(this.root!=null)
							this.root.pre=null;	
						break;
					}
					if(node.data==this.lastNode.data){
						this.lastNode.pre.next=null;
						this.lastNode=this.lastNode.pre;
						break;
					}
					if(node.pre!=null){
						node.pre.next=node.next;
					}

					if(node.next!=null){
						node.next.pre=node.pre;
					}
					
					node.next=null;
					node.pre=null;
					node=null;
					
					break;

				}else{
					node=node.next;
				}
			}
			this.length--;
		}

	}
	this.printL = function(node){
		
		if(node!=null){
			log(node.data+",");
			this.printL(node.next);
		}
		
	}
}