(function(w,d){
	//调用
	$.fn.kalendar=function(options){
		//_o=>option,
		//_ke=>Kalendar event(在视觉上有改变的函数全在此对象中),
		//_f => function（仅是数据处理，视觉无变动）
		//_i,_j,_k => for 循环_i,_j,_k
		var _o,_ke,_f,_i,_j,_k;
		w.docisbind = false;
		_o = $.extend({
			mn:'3',//同时显示的月份数
			type:3,//1:单选，2：起讫日期选择，3：多选
			wrap:'',
			mask:'',
			dom:$($(this).get(0)),
			opi:$($(this).get(0)),
			chineseMonth : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
			shiftdate:'',
			mindate:'',
			maxdate:''
		},options);
		if(typeof('string' === _o.opi)){ _o.opi = $(_o.opi) };
		_ke = {
			dHTML:function(){
				for(_i=0;_i<_o.mn;_i++){
					var _tb=$('<table class="table-condensed">'),_tbody=$('<tbody>');
					_tb.appendTo(_o.dd);
					$('<thead><tr><th><i class="icon-arrow-left">&lt;</i></th><th colspan="5" class="switch"></th><th><i class="icon-arrow-right">&gt;</i></th></tr><tr class="weeklist"><th class="dow">一</th><th class="dow">二</th><th class="dow">三</th><th class="dow">四</th><th class="dow">五</th><th class="dow">六</th><th class="dow">日</th></tr></thead>').appendTo(_tb);
					_tbody.appendTo(_tb);
					for(_j=0;_j<6;_j++){
						var _tr = $('<tr>');
						_tr.appendTo(_tbody);
						for(_k=0;_k<7;_k++){
							var _td = $('<td>');
							_td.appendTo(_tr);
						}
					}
					_o.dd.find('i:gt(0):lt(-1)').parents('th').css({'visibility':'hidden'});
					if(3===_o.type){
						$('<tfoot><tr><td colspan="7"><button>清空本月选中</button></td></tr></tfoot>').appendTo(_tb);
					}
				}
				if(3===_o.type){
					$('<div class="clearall"><button>清空所有已选日期</button></div>').appendTo(_o.dd);
				}
			},
			mHTML:function(){
				var _tb=$('<table class="table-condensed">'),_tbody=$('<tbody><tr><td colspan="3"></td></tr></tbody>');
				_tb.appendTo(_o.dm);
				$('<thead><tr><th><i class="icon-arrow-left">&lt;</i></th><th class="switch"></th><th><i class="icon-arrow-right">&gt;</i></th></tr></thead>').appendTo(_tb);
				_tbody.appendTo(_tb);
				for(_j=0;_j<12;_j++){
					var _span = $('<span>');
					_span.text(_j+1+'月');
					_span.appendTo(_tb.find('td'));

				}
			},
			yHTML:function(startY){
				var _tb=$('<table class="table-condensed">'),_tbody=$('<tbody><tr><td colspan="3"></td></tr></tbody>');
				_tb.appendTo(_o.dy);
				$('<thead><tr><th><i class="icon-arrow-left">&lt;</i></th><th class="switch"></th><th><i class="icon-arrow-right">&gt;</i></th></tr></thead>').appendTo(_tb);
				_tbody.appendTo(_tb);
				for(_j=0;_j<12;_j++){
					var _span = $('<span>');
					_span.text(_j+startY);
					_span.appendTo(_tb.find('td'));
				}
			},
			drawStart:function(_x,_y){
				var _pos,_tdpos,_ptd;
				if(_o.mask==''){
					_o.mask={
						x:_x,
						y:_y
					};
				}
				if(_x<_o.dd.offset().left){_x=_o.dd.offset().left;}
				if(_x>_o.dd.offset().left+_o.dd.outerWidth()){_x=_o.dd.offset().left+_o.dd.outerWidth();}
				if(_y<_o.dd.offset().top){_y=_o.dd.offset().top;}
				if(_y>_o.dd.offset().top+_o.dd.outerHeight()){_y = _o.dd.offset().top +_o.dd.outerHeight();}
				$('.mask').css({
					left:(_x<_o.mask.x?_x:_o.mask.x) - _o.dd.offset().left,
					top:(_y<_o.mask.y?_y:_o.mask.y) - _o.dd.offset().top,
					width:Math.abs(_o.mask.x-_x),
					height:Math.abs(_o.mask.y-_y),
				});
				
				_pos={
					x1:$('.mask').offset().left,
					y1:$('.mask').offset().top,
					x2:$('.mask').offset().left + $('.mask').outerWidth(),
					y2:$('.mask').offset().top + $('.mask').outerHeight()
				};
				_o.dd.find('table tbody td.day.masked').removeClass('masked');
				$.each(_o.dd.find('table tbody td.day'),function(i){
					if($(this).hasClass('active')){
						return;
					}
					_ptd=$(this);
					_tdpos={
						x1:_ptd.offset().left,
						y1:_ptd.offset().top,
						x2:_ptd.offset().left+_ptd.outerWidth(),
						y2:_ptd.offset().top+_ptd.outerHeight()
					}
					if(_tdpos.x2>=_pos.x1&&_tdpos.x1<=_pos.x2&&_tdpos.y2>=_pos.y1&&_tdpos.y1<=_pos.y2){
						_ptd.addClass('masked');
					}
				});
			},
			drawEnd:function(_x,_y){
				$.each(_o.dd.find('table tbody td.masked'),function(i){
					if($(this).hasClass('active')){
						return;
					}
					_ke.pushDate($(this).attr('data-date'));
				});
				_ke.sortDate();
				_o.mask='';
				$('.mask').remove();
			},
			drawMask:function(){
				$('<div>').addClass('mask').appendTo(_o.dd);
			},
			//给日历<天>层填充数据
			fillD:function(_sy,_sm){
				var _mi,_di,_ty,_tm,_ttd,_std,_dtable=$('.datelayer .datepicker-day table');
				for(_mi=0;_mi<_dtable.length;_mi++){
					_ttd = _dtable.eq(_mi).find('tbody td');
					_ty = _sy+parseInt((_sm+_mi-1)/12);
					_tm = ( _sm + _mi ) % 12;
					if(0==_tm){_tm=12;}
					_dtable.eq(_mi).attr({
						'data-year':_ty,
						'data-month':_tm
					}).find('.switch').text(_ty + '年' + _o.chineseMonth[_tm-1]);
					_std=(new Date(_ty+'/'+_tm+'/1').getDay()+6) % 7;
					if( 2==_tm && 2>_std ){_std+=7}
					_ttd.removeClass().removeAttr('data-date').text('');
					/*console.log(_o.mindate,new Date(2016,4,10) < new Date('2015/6/30'));
					console.log(_o.maxdate,new Date('2015/6/30')<new Date('2016,5,31'));*/

					for(_di=0;_di<_f._getmaxday(_ty,_tm);_di++){
						_ttd.eq(_di+_std).addClass('day').attr('data-date',_f._fdate(_ty,_tm,_di+1)).text(_di+1);
						if(_o.opi.val().indexOf(_f._fdate(_ty,_tm,_di+1))>=0){
							_ttd.eq(_di+_std).addClass('active');
						}
						if( _o.mindate!=='' && new Date(_ty,_tm-1,_di+1) < new Date(_o.mindate.replace(/-/g,'/'))){
							_ttd.eq(_di+_std).addClass('disabled');
						}

						if( _o.maxdate!=='' && new Date(_o.maxdate.replace(/-/g,'/')) < new Date(_ty,_tm-1,_di+1)){
							_ttd.eq(_di+_std).addClass('disabled');
						}

					}
				}
			},
			
			//给日历层<月>填充数据
			fillM:function(_year,_month,_the){
				$('.datelayer .datepicker-months .switch').text(_year);
				$('.datelayer .datepicker-months tbody span').eq(_month-1).addClass('active').siblings().removeAttr('class');
				$('.datelayer .datepicker-months table').attr('data-table-index',_the);
			},
			
			//给日历层<年>填充数据
			fillY:function(_year){
				var _st_y = parseInt(_year / 12) * 12,_ySpan = $('.datelayer .datepicker-years tbody span'),_oldy=parseInt($('.datelayer .datepicker-years table').attr('data-year'));
				$('.datelayer .datepicker-years .switch').text(_st_y+'~'+(_st_y+11));
				_ySpan.removeAttr('class');//去除所有span的active样式
				for(_i=0;_i<12;_i++){
					_ySpan.eq(_i).text(_st_y+_i);
					if(_st_y+_i == _oldy){
						_ySpan.eq(_i).addClass('active');
					}
				}

			},
			//单日点击
			clickD:function(_date){
				if(3===_o.type){
					_o.shiftdate='';
					if(_o.opi.val().indexOf(_date)+1){
						_ke.delDate(_date);
					}else{
						_ke.addDate(_date);
					}
				}else{
					_o.opi.val('');
					_o.dd.find("td.day.active").removeClass('active');
					_ke.addDate(_date);
				}
				
			},
			shiftClick:function(_d){
				if(_o.shiftdate!=''){
					var _t_d = new Date(_o.shiftdate.replace(/-/g,'/')).getTime(),_max_d =  new Date(_d.replace(/-/g,'/')).getTime();
					if(_max_d<_t_d){
						_t_d = _max_d;
						_max_d = new Date(_o.shiftdate.replace(/-/g,'/')).getTime();
					}
					do{
						_ke.pushDate(_f._stamp2fdate(_t_d));
						_t_d += 86400000;
					}while(_t_d<=_max_d);
					_ke.sortDate();
				}
			},
			delDate:function(_d){
				_o.shiftdate='';
				var _darr = _o.opi.val().split(',');
				_darr.splice(_darr.indexOf(_d),1);
				$('td[data-date="'+_d+'"]').removeClass('active');
				_o.opi.val(_darr.join(','));
				
			},
			addDate:function(_d){
				_o.shiftdate = _d;
				if(_o.opi.val().indexOf(_d)==-1){
					_ke.pushDate(_d);
					_ke.sortDate();
				}
			},
			pushDate:function(_d){
				if(_o.opi.val().indexOf(_d)==-1){
					var _darr = _o.opi.val()=='' ? [] : _o.opi.val().split(',');
					_darr.push(_d);
					_o.opi.val(_darr.join(','));
					$('td[data-date="'+_d+'"]').addClass('active');
				}
			},
			sortDate:function(){
				var _darr = _o.opi.val()=='' ? [] : _o.opi.val().split(',');
				_darr.sort();
				_o.opi.val(_darr.join(','));
			},
			//打开日历显示层
			op:function(){
				if(1<=$('.datelayer').length){return false;}
				_o.wrap=$('<div class="datepicker drapdown datelayer">');
				_o.wrap.css({
					top:function(){
						return _o.opi.position().top+_o.opi.outerHeight(true)+7;
					},
					left:function(){
						return _o.opi.position().left;
					}
				}).appendTo('body');
				
				_o.dd=$('<div class="datepicker-day">');
				_o.dd.appendTo(_o.wrap);
				_ke.dHTML();
				_ke.fillD(_o.sYear,_o.sMonth);
				
				_o.dm=$('<div class="datepicker-months">');
				_o.dm.appendTo(_o.wrap);
				_ke.mHTML();
				_o.dy=$('<div class="datepicker-years">');
				_o.dy.appendTo(_o.wrap);
				_ke.yHTML(_o.sYear);
				_f._bind();
				
				_f._bdoc();
				_f._stopp();
			},
			
			//移除日历显示层
			c:function(){
				$(".datelayer").remove();
			},

			//输出到文本框
			out:function(){

			}
			
		};
		_f = {
			//根据年月返回最大当月天数
			_getmaxday:function(yyyy,mm){
				mm++;
				if(mm>12){mm-=12;yyyy++;}
				return new Date(_f._date2stamp(yyyy,mm,1)-86400000).getDate();
			},

			//日期转换为时间戳
			_date2stamp:function(yyyy,mm,dd){
				return (new Date(yyyy+'/'+mm+'/'+dd).getTime());
			},

			//时间戳转换为日期
			_stamp2date:function(stamp){
				return (new Date(stamp).getFullYear()+'-'+(new Date(stamp).getMonth()+1)+'-'+new Date(stamp).getDate());
			},
			_stamp2fdate:function(stamp){
				return _f._fdate(new Date(stamp).getFullYear(),(new Date(stamp).getMonth()+1),new Date(stamp).getDate());
			},

			//字符串格式日期转换为date对象
			_char2date:function(){},
			_fdate:function(Y,M,D){
				return (Y+'-0'+M+'-0'+D).replace(/-[\d]{1}([\d]{2})/g,'-$1');
			},
			//给document绑定关闭
			_bdoc:function(){
				if( false === w.docisbind){
					$(document).click(function(){
						_ke.c();
					});
					w.docisbind = true;
				}
			},
			_getClickType:function(_clickObj){
				return _clickObj.parents('[class^="datepicker-"]').attr('class').replace('datepicker-','');
			},
			//绑定事件
			_bind:function(){
				var _ctype,_arr;
				$('.datelayer i').unbind().bind('click',function(){
					_ctype=_f._getClickType($(this));
					_arr = $(this).parent().index()-1;
					if('day'===_ctype){
						_o.sMonth+=_arr;
						if(_o.sMonth>12 || _o.sMonth < 1){
							_o.sMonth = _o.sMonth > 12 ? 1 : 12 ;
							_o.sYear += _arr;
						}
						_o.sDay = 1;
						_ke.fillD(_o.sYear,_o.sMonth);
						return false;
					}
					if('months'===_ctype){
						$('.datelayer .datepicker-months .switch').text(function(){
							return parseInt($(this).text())+_arr;
						});
						return false;
					}
					if('years'===_ctype){
						var _newY= parseInt($('.datelayer .datepicker-years tbody span:eq(0)').text()) + _arr*12;
						_ke.fillY(_newY);
						return false;
					}
				});
				$('.datelayer .switch').unbind().bind('click',function(){
					_ctype=_f._getClickType($(this));
					if('day'===_ctype){
						$('.datelayer .datepicker-months').css('display','block').siblings().css('display','none');
						_ke.fillM($(this).parents('table').attr('data-year'),$(this).parents('table').attr('data-month'),$(this).parents('table').index());
					}
					if('months'===_ctype){
						$('.datelayer .datepicker-years').css('display','block').siblings().css('display','none');
						$('.datelayer .datepicker-years table').attr('data-year',$(this).text());
						_ke.fillY($(this).text());
						return false;
					}
					return false;
				});
				$('.datelayer table tbody span').unbind().bind('click',function(){
					_ctype=_f._getClickType($(this));
					if('years'===_ctype){
						$('.datelayer .datepicker-months').css('display','block').siblings().css('display','none');
						$('.datelayer .datepicker-months .switch').text($(this).text());
						return false;
					}
					if('months'===_ctype){
						$('.datelayer .datepicker-day').css('display','block').siblings().css('display','none');
						_o.sYear = parseInt($(this).parents('table').find('.switch').text());
						_o.sMonth = parseInt($(this).text()) - parseInt( $(this).parents('table').attr('data-table-index'));
						if(_o.sMonth<=0){
							_o.sMonth+=12;
							_o.sYear--;
						}
						_ke.fillD(_o.sYear,_o.sMonth);
						return false;
					}
				});
				
				if(3 === _o.type){
					$('.datelayer .datepicker-day').css({'-moz-user-select':'none'}).bind('selectstart',function(e){
						return false;
					});

					//框选
					_o.usedmd = false;
					_o.ismd = false;
				
					$('.datelayer .datepicker-day').unbind().bind('mousedown',function(e){
						_o.ismd = true;
						if($('.mask').length<=1){
						$('<div>').addClass('mask').appendTo(_o.dd);
						}
						if(false === _o.usedmd){
							_o.usedmd = true;
							$(document).bind('mousemove',function(e){
								if(true===_o.ismd){
									_ke.drawStart(e.clientX,e.clientY);
								}
							});
							$(document).bind('mouseup',function(e){
								if(true===_o.ismd){
									_o.ismd = false;
									_ke.drawEnd(e.clientX,e.clientY);
								}
							});
						}
					});
				}
				$('.datelayer .datepicker-day tbody td').unbind().bind('click',function(e){
					if($(this).hasClass('disabled')){return false;}
					if($(this).hasClass('day')){
						if(true===e.shiftKey){
							if(3===_o.type){
								_ke.shiftClick($(this).attr('data-date'));
							}else{
								_ke.clickD($(this).attr('data-date'));
							}
						}else{
							_ke.clickD($(this).attr('data-date'));
						}
						if(3!==_o.type){
							_ke.c();	
						}
					}
				});

				//清空每月
				$('.datelayer .datepicker-day tfoot button').unbind().bind('click',function(){
					$(this).parents('table').find('tbody td.active').click();
				});
				//全部清空
				$('.clearall').unbind().bind('click',function(){
					_o.opi.val('');
					_o.dd.find('.day.active').removeClass('active masked');
				});
			},
			
			//解绑事件
			_unbind:function(){},
			//点击日历层禁止冒泡至document
			_stopp:function(){
				_o.wrap.click(function(e){
					e.stopPropagation();
				});
			}

		};

		
		
		_o.dom.click(function(e){
			_o.tDate	=	_o.sDate	= new Date();
			_o.tYear	=	_o.sYear	= _o.tDate.getFullYear();
			_o.tMonth	=	_o.sMonth	= _o.tDate.getMonth()+1;
			_o.tDay		=	_o.sDay		= _o.tDate.getDate();

			if(_o.opi.val()!=''){
				_o.sDate	= new Date(_o.opi.val().split(',')[0].replace(/-/g,'/') + ' 00:00:00');
				_o.sYear	= _o.sDate.getFullYear();
				_o.sMonth	= _o.sDate.getMonth()+1;
				_o.sDay		= _o.sDate.getDate();
			}
			e.stopPropagation();
			_ke.op();
		});
	}
})(window,document);