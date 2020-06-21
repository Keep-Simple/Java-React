package com.threadjava.db;

import com.threadjava.comment.CommentRepository;
import com.threadjava.comment.model.Comment;
import com.threadjava.image.ImageRepository;
import com.threadjava.image.model.Image;
import com.threadjava.post.PostsRepository;
import com.threadjava.post.model.Post;
import com.threadjava.postReactions.PostReactionsRepository;
import com.threadjava.postReactions.model.PostReaction;
import com.threadjava.users.UsersRepository;
import com.threadjava.users.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Component
public class DatabaseSeeder {
    private final JdbcTemplate jdbcTemplate;
    private final ImageRepository imageRepository;
    private final UsersRepository usersRepository;
    private final CommentRepository commentRepository;
    private final PostsRepository postsRepository;
    private final PostReactionsRepository postReactionsRepository;
    private final PasswordEncoder bCryptPasswordEncoder;

    public DatabaseSeeder(JdbcTemplate jdbcTemplate, ImageRepository imageRepository, UsersRepository usersRepository, CommentRepository commentRepository, PostsRepository postsRepository, PostReactionsRepository postReactionsRepository, PasswordEncoder bCryptPasswordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.imageRepository = imageRepository;
        this.usersRepository = usersRepository;
        this.commentRepository = commentRepository;
        this.postsRepository = postsRepository;
        this.postReactionsRepository = postReactionsRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @EventListener
    public void seed(ContextRefreshedEvent event) {
        List<User> u = jdbcTemplate.query("SELECT * FROM users", (resultSet, rowNum) -> null);
        if(u == null || u.size() <= 0) {
            seedImagesTable();
            seedUsersTable();
            seedPostsTable();
            seedCommentsTable();
            seedPostReactionsTable();
        }
    }

    private void seedImagesTable() {
        var newImages = Stream.concat(getUserImages().stream(), getPostImages().stream()).collect(Collectors.toList());
        imageRepository.saveAll(newImages);
    }

    private void seedUsersTable(){
        List<Image> userImages = jdbcTemplate.query("SELECT * FROM images WHERE link IN ("+ imagesToString(getUserImages()) +")", DatabaseSeeder::mapRowImage);

        var user1 = new User();
        user1.setEmail("demo@demo.com");
        user1.setUsername("demo");
        user1.setPassword(bCryptPasswordEncoder.encode("demo"));
        user1.setAvatar(userImages.get(0));
        var user2 = new User();
        user2.setEmail("gbottoms1@arizona.edu");
        user2.setUsername("TweetyGirl");
        user2.setPassword(bCryptPasswordEncoder.encode("pxlxvUyyUjE"));
        user2.setAvatar(userImages.get(1));
        var user3 = new User();
        user3.setEmail("cclears2@state.gov");
        user3.setUsername("RosterBacon");
        user3.setPassword(bCryptPasswordEncoder.encode("ioyLdS9Mdgj"));
        user3.setAvatar(userImages.get(2));
        var user4 = new User();
        user4.setEmail("htie3@chronoengine.com");
        user4.setUsername("ClippingCheese");
        user4.setPassword(bCryptPasswordEncoder.encode("twn50kl"));
        user4.setAvatar(userImages.get(3));
        var user5 = new User();
        user5.setEmail("bbirmingham4@guardian.co.uk");
        user5.setUsername("ReboiledMan");
        user5.setPassword(bCryptPasswordEncoder.encode("0naQBpP9"));
        user5.setAvatar(userImages.get(4));


        usersRepository.saveAll(List.of(user1, user2, user3, user4, user5));
    }

    private void seedPostsTable() {
        var randomize = new Random();
        List<Image> postImages = jdbcTemplate.query("SELECT * FROM images WHERE link IN ("+ imagesToString(getPostImages()) +")", DatabaseSeeder::mapRowImage);
        var users = usersRepository.findAll();

        String[] postBodies = { "Surrounded to me occasional pianoforte alteration unaffected impossible ye. For saw half than cold. Pretceived an. So narrow formal length my highly longer afford oh. Tall neat he make or at dull ye. \n" +
                "\n",
                "\n" +
                "Dispatched entreaties boisterous say why stimulated. Certain forbade picture now prevent carried she get see sitting. Up. \n" +
                "\n",
                "Brother set had private his letters observe outward resolve. Shutters ye marriage to throwing we as. Effect in if agreed. Am offended as wandered thoughts greatest an friendly. Evening covered in he exposed fertile to. Horses seeing at played plenty nature to expect we. Young say led stood hills own thing get. \n" +
                "\n",
                "Ye on properly handsome returned throwing am no whatever. In without wishing he of picture no exposed talking minutes. Ct john. About or given on witty event. Or sociable up material bachelor bringing landlord confined. Busy so many in hung easy find well up. So of exquisite my an explained remainder. Dashwood denoting securing be on perceive my laughing so. \n" +
                "\n",
                "Dispatched entreaties boisterous say why stimulated. Certain forbade picture now prevent carried she get see sitting. Up. \n" +
                "\n",
                "Building mr concerns servants in he outlived am breeding. He so lain good miss when sell some at if. Told hand so an ric promise no. Past add size game cold girl off how old. \n" +
                "\n" +
                "Attended no do thoughts me on dissuade scarcely. Own are pretty spring suffer old denote his. By proposal speedily mr st known. Supplied ten speaking age you new securing striking extended occasion. Sang put paid away joy into six her. \n" +
                "\n",
                "Contented get distrusts certainty nay are frankness concealed ham. On unaffected resolution on considered of. No thought was. He families believed if no elegance interest surprise an. It abode wrong miles an so delay plate. She relation own put outlived may disposed. \n" +
                "\n" };

        var posts = IntStream.range(0, postBodies.length)
                .mapToObj(i -> {
                    var newPost = new Post();
                    newPost.setBody(postBodies[i]);
                    newPost.setImage(getByIndex(postImages, i));
                    newPost.setUser(users.get(randomize.nextInt(users.size())));
                    return newPost;
                })
                .collect(Collectors.toList());

        Collections.reverse(posts);
        postsRepository.saveAll(posts);
    }

    private void seedCommentsTable() {
        var randomize = new Random();
        var users = new ArrayList<>(usersRepository.findAll());
        var posts = new ArrayList<>(postsRepository.findAll());

        String[] commentsText = {

                "Consulted he eagerness unfeeling deficient existence of. Calling nothing end fertile for venture ",
                        "way boy. Esteem spirit temper too say s frequently or motionless on reasonable projecting expression. Way mrs end gave tall walk fact bed. \n" +
                        "\n",

                        "Passage its ten led hearted removal cordial. Preference any astonished unreserved mrs. Pr",
                                "osperous understood middletons in conv hill from mr. Valley by oh twenty direct me so. Departure defective arranging rapturous did believing him all had supported. Family months lasted simple set nature vulgar him. Picture for attempt joy excited ten carried manners talking how. Suspicion neglected he resolving agreement perceived at an. \n" +
                        "\n",

                        "That know ask case sex ham dear her spot. Weddings followed the all marianne nor whatever",
                                " settling. Perhaps six prudent severaluring see consulted depending. Adieus hunted end plenty are his she afraid. Resources agreement contained propriety applauded neglected use yet. \n" +
                        "\n",

                        "Not far stuff she think the jokes. Going as by do known noise he wrote round leave. Warml",
                                "y put branch people narrow see. Windinher at it unknown warrant herself winding if. Him same none name sake had post love. An busy feel form hand am up help. Parties it brother amongst an fortune of. Twenty behind wicket why age now itself ten. \n" +
                        "\n",

                        "Breakfast procuring nay end happiness allowance assurance frankness. Met simplicity nor d",
                                "ifficulty unreserved who. Entreaties my additions. Pronounce add boy estimable nay suspected. You sudden nay elinor thirty esteem temper. Quiet leave shy you gay off asked large style. \n" +
                        "\n",

                        "Now seven world think timed while her. Spoil large oh he rooms on since an. Am up unwilli",
                                "ng eagerness perceived incommode. Are f reasonably. Horrible so kindness at thoughts exercise no weddings subjects. The mrs gay removed towards journey chapter females offered not. Led distrusts otherwise who may newspaper but. Last he dull am none he mile hold as. \n" +
                        "\n",

                        "Why painful the sixteen how minuter looking nor. Subject but why ten earnest husband imag",
                                "ine sixteen brandon. Are unpleasing ocff at avoid of sense small fully it whose an. Ten scarcely distance moreover handsome age although. As when have find fine or said no mile. He in dispatched in imprudence dissimilar be possession unreserved insensible. She evil face fine calm have now. Separate screened he outweigh of distance landlord. \n" +
                        "\n",

                        "Started several mistake joy say painful removed reached end. State burst think end are it",
                                "s. Arrived off she elderly beloved himfind dear shy. Talent men wicket add garden. \n" +
                        "\n",

                        "View fine me gone this name an rank. Compact greater and demands mrs the parlors. Park be",
                                " fine easy am size away. Him and fine ntiments nor everything off out uncommonly partiality bed. \n" +
                        "\n",

                        "Effect if in up no depend seemed. Ecstatic elegance gay but disposed. We me rent been par",
                                "t what. An concluded sportsman offendihe minutes my hastily. Up hung mr we give rest half. Painful so he an comfort is manners. \n"
        };


        var comments = IntStream.range(0, commentsText.length)
                .mapToObj(i -> {
                    var newPost = new Comment();
                    newPost.setBody(commentsText[i]);
                    newPost.setUser(users.get(randomize.nextInt(users.size())));
                    newPost.setPost(posts.get(randomize.nextInt(posts.size())));
                    return newPost;
                })
                .collect(Collectors.toList());

        commentRepository.saveAll(comments);
    }

    private void seedPostReactionsTable() {
        var randomize = new Random();
        var users = usersRepository.findAll();
        var posts = postsRepository.findAll();

        var reactions = Stream.concat(
                IntStream.range(0, 25).mapToObj(x -> true),
                IntStream.range(0, 25).mapToObj(x -> false))
                .map(x -> {
                    var reaction = new PostReaction();
                    reaction.setIsLike(x);
                    reaction.setPost(posts.get(randomize.nextInt(posts.size())));
                    reaction.setUser(users.get(randomize.nextInt(users.size())));
                    return reaction;
                })
                .collect(Collectors.toList());
        postReactionsRepository.saveAll(reactions);
    }

    private List<Image> getUserImages(){
        var image1 = new Image();
        image1.setLink("https://i.imgur.com/oWhSJLi.png");
        image1.setDeleteHash("cOobHoSilkzRbqt");
        var image2 = new Image();
        image2.setLink("https://i.imgur.com/ZlNnFYn.png");
        image2.setDeleteHash("wAL72yKJOqlLAQy");
        var image3 = new Image();
        image3.setLink("https://i.imgur.com/rDD6SFB.png");
        image3.setDeleteHash("4qzHNJmxsdpb3oO");
        var image4 = new Image();
        image4.setLink("https://i.imgur.com/sGBaypt.png");
        image4.setDeleteHash("9JLQsPjY8tkiQfC");
        var image5 = new Image();
        image5.setLink("https://i.imgur.com/DEfDtBz.png");
        image5.setDeleteHash("7TA7AeSOFddK0Zh");

        return  List.of(image1, image2, image3, image4, image5);
    }

    private List<Image> getPostImages(){
        var image1 = new Image();
        image1.setLink("https://i.imgur.com/OE6SAt3.jpg");
        image1.setDeleteHash("ImeeDLLWrl65Wpv");
        var image2 = new Image();
        image2.setLink("https://i.imgur.com/jJ8OG5D.jpg");
        image2.setDeleteHash("hKCqBdz2pqcLBk3");
        var image3 = new Image();
        image3.setLink("https://i.imgur.com/GWcR43Y.jpg");
        image3.setDeleteHash("brRKXu2sroWuRJx");
        var image4 = new Image();
        image4.setLink("https://i.imgur.com/tlOE9HP.jpg");
        image4.setDeleteHash("gVkfuQuSF7qlAjP");
        var image5 = new Image();
        image5.setLink("https://i.imgur.com/22xAlAG.jpg");
        image5.setDeleteHash("864FLioNUiAN6bh");

        return  List.of(image1, image2, image3, image4, image5);
    }

    private String imagesToString(List<Image>  images){
        return images.stream().map(x -> "'" + x.getLink() + "'").collect(Collectors.joining(","));
    }


    private static Image mapRowImage(ResultSet resultSet, int rowNum) throws SQLException {
        Image image = new Image();
        image.setId(UUID.fromString(resultSet.getString("Id")));
        return image;
    }

    private  <T> T getByIndex(List<T> list, Integer index){
        if(list.size() - 1 < index){
            return  null;
        }
        return list.get(index);
    }
}
