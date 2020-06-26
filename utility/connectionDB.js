var conModel = require('../models/connection')

var category = ["Courses", "Workshops"];
var categoryDetails = [];
var conn;

conn = conModel.connectionModel("course1", "Artist Guild - Fine Arts", category[0], "We awaken the inner artist in you to rise and give shape to your thoughts, interpretations and expressions through the world of Fine Art. We provide you the apt forum to learn drawing and painting in your own unique style.", "AC-R-01", "Wednesday, October 23,2019", "10:30am", "12:30pm", "Indiana Robert", "../assets/image/fineArts.png");
categoryDetails.push(conn);
conn = conModel.connectionModel("course2", "Moulding Soul into the Clay - Pottery", category[0], "Experience the beauty of Pottery with The Art Connoisseurs and learn to create wonders with clay!", "AC-R-02", "Tuesday, October 22,2019", "10:30am", "1:00pm", "Mick Blake", "../assets/image/pottery.png");
categoryDetails.push(conn);
conn = conModel.connectionModel("course3", "Sculptors Hut - Sculpting", category[0], "An art form that is three dimensional in nature, one that lets you give life to your imagination with your hands and gives you a sense of pure creation - that is art of Sculpting.", "AC-R-03", "Saturday, October 26,2019", "3:00pm", "5:00pm", "Anish Kapoor", "../assets/image/sculpting.png");
categoryDetails.push(conn);
conn = conModel.connectionModel("course4", "The Touch of Tradition - Tanjore Painting", category[0], "The ancient art of Tanjore Painting symbolizes the grandeur and splendour of gold, fused with skillful expression of an artist. It is one of the most beautiful forms of art, with its roots tracing back to many centuries. Learning this art is your chance to revisit our cultural heritage and tradition.", "AC-R-04", "Thursday, October 26,2019", "1:00pm", "4:00pm", "Sadiv", "../assets/image/tanjorePainting.png");
categoryDetails.push(conn);
conn = conModel.connectionModel("course5", "Clay Smith - Terracotta Jewellery Making", category[0], "Create your own fashion statement with beautiful, colorful jewellery, delicately hand crafted by you! With this course you get a double benefit - you learn a new and exciting art form, plus you get to wear your own creations!", "AC-R-05", "Monday, October 28,2019", "10:30am", "2:00pm", "Aikyaa", "../assets/image/terracottaJewellery.png");
categoryDetails.push(conn);

conn = conModel.connectionModel("workshop1", "LIVE Portrait Sketching Workshop", category[1], "Presenting Live Portrait Sketching Workshop for all artists and budding artists! Here is a great opportunity for you to hone and develop your live portrait sketching skills.", "Charlotte Convention Center", "Sunday, November 3,2019", "9:0am", "3:30pm", "Paul Cadden", "../assets/image/portraitSketch.png");
categoryDetails.push(conn);
conn = conModel.connectionModel("workshop2", "Pottery and Clay Crafting Camps", category[1], "Bored of the usual routine? Looking to give yourself an innovative experience? The Art Connoisseurs has the perfect solution for you. Introducing a unique stress buster, one that will make you explore your inner artists - Pottery & Clay Crafting.", "Charlotte Convention Center", "Friday, November 1,2019", "9:30am", "6:00pm", "Jim Deason", "../assets/image/potteryWorkshop.png");
categoryDetails.push(conn);
conn = conModel.connectionModel("workshop3", "Tanjore Painting Workshop", category[1], "Tanjore Paintings are magnificent artwork depicting the various tales of Hindu deities. The artwork invoke the feelings of surrendering to the supremacy of the divine. The calming facial expressions in the art piece renders a sense of blessing to the one's bowing with respect.", "Charlotte Convention Center", "Thursday, November 7,2019", "9:30am", "7:30pm", "Sadiv", "../assets/image/tjPainting.png");
categoryDetails.push(conn);
conn = conModel.connectionModel("workshop4", "Art Cubs - Creative Hunt", category[1], "Art Cubs is a venture by The Art Connoisseurs to spike interest in art among young children. At their budding age, our courses will help develop their motor skills, patience and overall personalities. When the creativity of children is tapped at an early age, they have the opportunity of understanding the different nuances in the world of art and can choose to take it up as a hobby or professionally later in their lives.", "Charlotte Convention Center", "Saturday, November 2,2019", "9:30am", "4:00pm", "Gogi Saroj", "../assets/image/artCubs.png");
categoryDetails.push(conn);

function getConnections(){
  return categoryDetails;
}

function getConnection(id){
    var result = {}
    for(conn of categoryDetails){
        if(conn.id == id)
            result = conn;
    }
    console.log(result);
    return result;
}

module.exports = {
    getConnection :getConnection,
    getConnections :getConnections,
    category :category
}
