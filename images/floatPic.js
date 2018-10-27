var myFocus={
	$:function(id){return document.getElementById(id);},
	$$:function(tag,obj){return (typeof obj=='object'?obj:this.$(obj)).getElementsByTagName(tag);},
	$li:function(obj,n){return this.$$('li',this.$$('ul',obj)[n])},
	linear:function(t,b,c,d){return c*t/d + b;},
	easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t + b;},
	easeOut:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t - 1) + b;},
	easeInOut:function(t,b,c,d){return ((t/=d/2) < 1)?(c/2*t*t*t*t + b):(-c/2*((t-=2)*t*t*t - 2) + b);},
	style:function(obj,style){return (+[1,])?window.getComputedStyle(obj,null)[style]:obj.currentStyle[style];},//getStyle�򻯰�
	opa:function(obj,v){//ȡ�û����ö���͸����,Ĭ��100
		if(v!=undefined) {v=v>100?100:(v<0?0:v); obj.style.filter = "alpha(opacity=" + v + ")"; obj.style.opacity = (v / 100);}
		else return (!+[1,])?((obj.filters.alpha)?obj.filters.alpha.opacity:100):((obj.style.opacity)?obj.style.opacity*100:100);
	},
	animate:function(obj,prop,val,spd,type,fn){
		var opa=prop=='opacity'?true:false;
		if(opa&&obj.style.display=='none'){obj.style.display='';this.opa(obj,0);}
		var t=0,b=opa?this.opa(obj):parseInt(this.style(obj,prop)),c=val-b,d=spd||50,st=type||'easeOut',m=c>0?'ceil':'floor';
		if(obj[prop+'Timer']) clearInterval(obj[prop+'Timer']);
		obj[prop+'Timer']=setInterval(function(){
			if(opa&&t<d){myFocus.opa(obj,Math[m](myFocus[st](++t,b,c,d)));}
			else if(!opa&&t<d){obj.style[prop]=Math[m](myFocus[st](++t,b,c,d))+'px';}
			else {if(opa&&val==0){obj.style.display='none'}clearInterval(obj[prop+'Timer']);fn&&fn.call(obj);}
		},10);return this;
	},
	fadeIn:function(obj,speed,fn){this.animate(obj,'opacity',100,speed==undefined?20:speed,'linear',fn);return this;},
	fadeOut:function(obj,speed,fn){this.animate(obj,'opacity',0,speed==undefined?20:speed,'linear',fn);return this;},
	slide:function(obj,params,speed,easing,fn){for(var p in params) this.animate(obj,p,params[p],speed,easing,fn);return this;},
	stop:function(obj){//ֹͣ�����˶�����
		var animate=['left','right','top','bottom','width','height','opacity'];
		for(var i=0;i<animate.length;i++) if(obj[animate[i]+'Timer']) clearInterval(obj[animate[i]+'Timer']);
		return this;
	},
	initCSS:function(p){
		var css=[],oStyle = document.createElement('style');oStyle.type='text/css';
		if(p.width){css.push('.'+p.style+' *{margin:0;padding:0;border:0;list-style:none;}.'+p.style+'{position:relative;width:'+p.width+'px;height:'+p.height+'px;overflow:hidden;font:12px/1.5 Verdana,Geneva,sans-serif;background:#fff;}.'+p.style+' .loading{position:absolute;z-index:9999;width:100%;height:100%;color:#666;text-align:center;padding-top:'+0.3*p.height+'px;background:#fff url(/images/loading.gif) center '+0.4*p.height+'px no-repeat;}.'+p.style+' .pic,.'+p.style+' .pic *{width:'+p.width+'px;height:'+p.height+'px;}.'+p.style+' .txt li,.'+p.style+' .txt li span,.'+p.style+' .txt-bg{width:'+p.width+'px;height:'+p.txtHeight+'px;line-height:'+p.txtHeight+'px;overflow:hidden;}')}
		if(oStyle.styleSheet){oStyle.styleSheet.cssText=css.join('');} else {oStyle.innerHTML=css.join('');}
		var oHead = this.$$('head',document)[0];oHead.insertBefore(oStyle,oHead.firstChild);
	},
	setting:function(par){
		if(window.attachEvent){(function(){try{myFocus.$(par.id).className=par.style;myFocus.initCSS(par);}catch(e){setTimeout(arguments.callee,0);}})();window.attachEvent('onload',function(){myFocus[par.style](par)});}
����		else{document.addEventListener("DOMContentLoaded",function(){myFocus.$(par.id).className=par.style;myFocus.initCSS(par);},false);window.addEventListener('load',function(){myFocus[par.style](par)},false);}
	},
	addList:function(obj,cla){//����HMTL,claΪ�����б��class,���з�װ��:cla='txt'(����alt����),cla='num'(���ɰ�ť����),cla='thumb'(����Сͼ)
		var s=[],n=this.$li(obj,0).length,num=cla.length;
		for(var j=0;j<num;j++){
			s.push('<ul class='+cla[j]+'>');
			for(var i=0;i<n;i++){s.push('<li>'+(cla[j]=='num'?('<a>'+(i+1)+'</a>'):(cla[j]=='txt'?this.$li(obj,0)[i].innerHTML.replace(/\>(.|\n|\r)*?(\<\/a\>)/i,'>'+(this.$$('img',obj)[i]?this.$$('img',obj)[i].alt:'')+'</a>'):(cla[j]=='thumb'?'<img src='+(this.$$('img',obj)[i].getAttribute("thumb")||this.$$('img',obj)[i].src)+' />':'')))+'<span></span></li>')};
			s.push('</ul>');
		}; obj.innerHTML+=s.join('');
	},
	switchMF:function(fn1,fn2,auto){
		return "box.removeChild(this.$$('div',box)[0]);var run=function(idx){("+fn1+")();if (index == n - 1) index = -1;var next = idx != undefined ? idx: index + 1;("+fn2+")();index=next;};run(index);if("+auto+"!==false) var auto=setInterval(function(){run()},t);box.onmouseover=function(){if(auto) clearInterval(auto);};box.onmouseout=function(){if(auto) auto=setInterval(function(){run()},t);}"
	},
	bind:function(arrStr,type,delay){
		return "for (var j=0;j<n;j++){"+arrStr+"[j].index=j;if("+type+"=='click'){"+arrStr+"[j].onmouseover=function(){if(this.className!='current') this.className='hover'};"+arrStr+"[j].onmouseout=function(){if(this.className=='hover') this.className=''};"+arrStr+"[j].onclick=function(){if(this.index!=index) run(this.index)};}else if("+type+"=='mouseover'){"+arrStr+"[j].onmouseover=function(){var self=this;if("+delay+"==0){if(!self.className) run(self.index)}else "+arrStr+".d=setTimeout(function(){if(!self.className) run(self.index)},"+(delay==undefined?100:delay)+")};"+arrStr+"[j].onmouseout=function(){clearTimeout("+arrStr+".d)};}else{alert('myFocus ��֧���������¼� \"'+"+type+"+'\"');break;}}"
	},
	extend:function(fnObj){for(var p in fnObj) this[p]=fnObj[p];}
}

myFocus.extend({
	mF_liuzg:function(par){//*********************Ѥ����Ƭ���******************
		var box=this.$(par.id);
		this.addList(box,['txt','num']);//���ul�б�
		var pic=this.$li(box,0),n=pic.length;
		var c=par.height%par.chip?8:par.chip,h=par.height/c,pics=[];
		for(var i=0;i<c;i++){
			pics.push('<li><p>')
			for(var j=0;j<n;j++) pics.push(pic[j].innerHTML);
			pics.push('</p></li>')
		}
		this.$$('ul', box)[0].innerHTML=pics.join('');
		var pic=this.$li(box,0),txt=this.$li(box,1),btn=this.$li(box,2),index = 0,t=par.time*1000;
		//CSS
		for(var i=0;i<c;i++){//��ʼ����ʽ����
			this.$$('p',pic[i])[0].style.top=-i*h+'px';
			pic[i].style.height=h+'px';
			this.$$('p',pic[i])[0].style.height=par.height*c+'px';
		}
		//PLAY
		eval(this.switchMF(function(){
			txt[index].style.display='none';
			btn[index].className = '';
		},function(){
			var tt=par.type==4?Math.round(1+(Math.random()*(3-1))):par.type;//Ч��ѡ��
			var spd=tt==2?20:(tt==1?80:Math.round(20+(Math.random()*(80-20))));
			for(var i=0;i<c;i++){
				if(tt==3) spd=Math.round(20+(Math.random()*(80-20)));
				myFocus.slide(myFocus.$$('p',pic[i])[0],{top:-next*c*h-i*h},spd);
				spd=tt==2?spd+10:(tt==1?spd-10:spd);
			}
			txt[next].style.display='block';
			btn[next].className = 'current';
		}))
		eval(this.bind('btn','par.trigger',par.delay));
		for(var i=0,lk=this.$$('a',box),ln=lk.length;i<ln;i++) lk[i].onfocus=function(){this.blur();}//ȥ�����߿�
	}
})
//����Ϊ����ͼ�ĵ��ã�������ҳ����λ�õ���
myFocus.setting({
	style:'mF_liuzg',//�����ʽ
	id:'myFocus',//����ͼID
	trigger:'click',//��ť�л�ģʽ��'click'(�������)/'mouseover'(��ͣ����,Ĭ����0.1���ӳ٣�����������Ӳ���'delay:����'����)
	time:4,//�л�ͼƬ��ʱ��������λ��
	chip:5,//ͼƬ��Ƭ�������ܱ�����ͼ�ĸ���������Ч��Ĭ��Ϊ8Ƭ
	type:4,//��ƬЧ����1Ϊ˦ͷ��2Ϊ˦β��3Ϊ���ң�4Ϊ���Ч��
	txtHeight:36,//���ֲ�ߣ�36Ϊ�Ƽ���0Ϊ����
	width:261,//��(��ͼ)��ע��:��������ͼ�Ŀ���ڻ����ͼƬ��
	height:292//��(��ͼ)��ע��ͬ��
});