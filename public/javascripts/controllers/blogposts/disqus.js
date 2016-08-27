var disqus_config = function () {
    this.page.url = "https://#{data.host}/blogposts/#{data.blogpost._id}";
    this.page.identifier = "/blogposts/#{data.blogpost._id}";
    this.page.title = "#{data.blogpost.title}";
};
(function () {
    var d = document, s = d.createElement('script');
    s.src = '//webplatform-2.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
})();
