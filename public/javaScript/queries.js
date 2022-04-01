var faq=document.getElementById('faqid');
var myq=document.getElementById('myqid');
var laq=document.getElementById('laqid');
faq.addEventListener('click',function(){
  document.getElementById('faqdiv').classList.remove('myqueries');
  document.getElementById('myqdiv').classList.add('myqueries');
  document.getElementById('laqdiv').classList.add('myqueries');
  faq.classList.remove('current');
  myq.classList.add('current');
  faq.classList.add('faq');
  myq.classList.remove('faq');
  laq.classList.remove('faq');
  laq.classList.add('current');
});
myq.addEventListener('click',function(){
  document.getElementById('faqdiv').classList.add('myqueries');
  document.getElementById('myqdiv').classList.remove('myqueries');
  document.getElementById('laqdiv').classList.add('myqueries');
  myq.classList.remove('current');
  faq.classList.add('current');
  faq.classList.remove('faq');
  myq.classList.add('faq');
  laq.classList.remove('faq');
  laq.classList.add('current');
});
laq.addEventListener('click',function(){
  document.getElementById('faqdiv').classList.add('myqueries');
  document.getElementById('myqdiv').classList.add('myqueries');
  document.getElementById('laqdiv').classList.remove('myqueries');
  faq.classList.add('current');
  myq.classList.add('current');
  faq.classList.remove('faq');
  myq.classList.remove('faq');
  laq.classList.add('faq');
  laq.classList.remove('current');
});


