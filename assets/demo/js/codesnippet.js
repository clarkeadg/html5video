function codeSnipet(url,jcont) {
  $.get(url,function(a,b) {
    console.log(a.b)
    a = $('<div>').text(a).html();
    jcont.html('<pre><code>'+a+'</code></pre>');
  });
}
