document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // GENEMODELIX JOURNAL - JAVASCRIPT
    // =========================================================

    let registeredAuthors = [];
    let currentLoggedInAuthor = null;
    let isAuthorLoginMode = false;
    let userHasPaidSubscription = false;


    // =========================================================
    // INITIAL JOURNAL DATA
    // =========================================================

    let journalDatabase = [
        {
            id: 1,
            authorId: "GJIB-AUTH-1001",
            title: "Machine Learning Applications in Precision Oncology & Cancer Proteomics",
            author: "Computational Biology Research Group",
            access: "free",
            content: "An integrative review detailing high-throughput transcriptomic profiling combined with artificial intelligence algorithms to map targeted drug resistance in precision medicine."
        },

        {
            id: 2,
            authorId: "GJIB-AUTH-1002",
            title: "Molecular Docking & Virtual Screening Protocols for Novel Biomolecules",
            author: "Genemodelix Integrative Drug Discovery Group",
            access: "lock",
            content: "RESTRICTED ACCESS ARTICLE: Quantitative structure-activity relationship (QSAR) modeling and structural bioinformatic docking simulations for targeted inhibition pathways."
        }
    ];


    // =========================================================
    // DOM ELEMENTS
    // =========================================================

    const articlesFeedContainer =
        document.getElementById('dynamic-articles-feed');

    const submitArticleBtn =
        document.getElementById('submitArticleBtn');

    const userStatusTag =
        document.getElementById('userStatusTag');

    const subscriberBtn =
        document.getElementById('subscriberBtn');


    // =========================================================
    // GENERATE UNIQUE AUTHOR ID
    // =========================================================

    function generateUniqueAuthorId() {

        let randomNum;

        do {
            randomNum =
                Math.floor(1000 + Math.random() * 9000);

        } while (
            registeredAuthors.some(
                author =>
                    author.authorId === `GJIB-AUTH-${randomNum}`
            )
        );

        return `GJIB-AUTH-${randomNum}`;
    }


    // =========================================================
    // DRAW ARTICLES
    // =========================================================

    function drawArticlesFeed() {

        if (!articlesFeedContainer) {
            return;
        }

        articlesFeedContainer.innerHTML = '';


        journalDatabase.forEach(item => {

            const card =
                document.createElement('div');

            card.className = 'article-card';


            const isLocked =
                item.access === 'lock' &&
                !userHasPaidSubscription;


            card.innerHTML = `

                <span class="badge ${item.access}">
                    ${
                        item.access === 'free'
                            ? 'Open Access'
                            : 'Subscription Required'
                    }
                </span>

                <h3>${item.title}</h3>

                <div class="card-meta">

                    Authors: ${item.author}

                    |

                    Author ID:
                    ${item.authorId || 'N/A'}

                    |

                    Article ID:
                    GM-2026-#00${item.id}

                </div>


                <div class="card-body">

                    ${
                        isLocked

                            ?

                        `
                        <div class="restriction-overlay">

                            <strong>
                                🔒 Material Access Denied.
                            </strong>

                            <br>

                            Full research paper text and computational
                            datasets are locked for Guest connections.
                            Log in using a subscriber account to read
                            full text.

                        </div>
                        `

                            :

                        `<p>${item.content}</p>`
                    }

                </div>

            `;


            articlesFeedContainer.appendChild(card);

        });

    }


    // =========================================================
    // TAB NAVIGATION
    // =========================================================

    document
        .querySelectorAll('.tab-link')
        .forEach(button => {

            button.addEventListener('click', () => {


                // Remove active from all buttons

                document
                    .querySelectorAll('.tab-link')
                    .forEach(btn => {

                        btn.classList.remove('active');

                        btn.setAttribute(
                            'aria-selected',
                            'false'
                        );

                    });


                // Hide all pages

                document
                    .querySelectorAll('.page')
                    .forEach(page => {

                        page.classList.remove('active');

                    });


                // Activate clicked button

                button.classList.add('active');

                button.setAttribute(
                    'aria-selected',
                    'true'
                );


                // Get target page

                const targetPage =
                    document.getElementById(
                        button.dataset.target
                    );


                if (targetPage) {

                    targetPage.classList.add('active');

                }


                // Scroll to top

                window.scrollTo({

                    top: 0,

                    behavior: 'smooth'

                });

            });

        });


    // =========================================================
    // GUIDELINES ACCORDION
    // =========================================================

    document
        .querySelectorAll('.accordion-trigger')
        .forEach(trigger => {

            trigger.addEventListener('click', () => {

                const parentBlock =
                    trigger.parentElement;

                const contentPanel =
                    trigger.nextElementSibling;


                if (!parentBlock || !contentPanel) {
                    return;
                }


                parentBlock.classList.toggle('open');


                if (
                    parentBlock.classList.contains('open')
                ) {

                    contentPanel.style.maxHeight =
                        contentPanel.scrollHeight + 'px';

                }

                else {

                    contentPanel.style.maxHeight =
                        '0px';

                }

            });

        });


    // =========================================================
    // AUTHOR AUTHENTICATION ELEMENTS
    // =========================================================

    const authModal =
        document.getElementById('authModal');

    const closeModalBtn =
        document.getElementById('closeModalBtn');

    const registerFields =
        document.getElementById('registerFields');

    const modalTitle =
        document.getElementById('modalTitle');

    const modalSubtitle =
        document.getElementById('modalSubtitle');

    const submitBtn =
        document.getElementById('submitBtn');

    const authorAuthForm =
        document.getElementById('authorAuthForm');

    const toggleContainer =
        document.getElementById('toggleContainer');


    // =========================================================
    // SHOW REGISTRATION SCREEN
    // =========================================================

    function showRegistrationScreen() {

        isAuthorLoginMode = false;


        if (registerFields) {

            registerFields.classList.remove('hidden');

        }


        if (modalTitle) {

            modalTitle.textContent =
                'New Author Registration';

        }


        if (modalSubtitle) {

            modalSubtitle.textContent =
                'Register to receive your unique Author ID before submitting a paper.';

        }


        if (submitBtn) {

            submitBtn.textContent =
                'Register & Get Author ID';

        }


        if (toggleContainer) {

            toggleContainer.innerHTML =
                `
                Already registered?

                <button
                    type="button"
                    class="btn-toggle"
                    id="toggleAuthMode">

                    Sign In

                </button>
                `;

        }

    }


    // =========================================================
    // SHOW LOGIN SCREEN
    // =========================================================

    function showLoginScreen() {

        isAuthorLoginMode = true;


        if (registerFields) {

            registerFields.classList.add('hidden');

        }


        if (modalTitle) {

            modalTitle.textContent =
                'Author Sign In';

        }


        if (modalSubtitle) {

            modalSubtitle.textContent =
                'Log in with your registered email and password to submit your paper.';

        }


        if (submitBtn) {

            submitBtn.textContent =
                'Log In & Continue';

        }


        if (toggleContainer) {

            toggleContainer.innerHTML =
                `
                First time submitting?

                <button
                    type="button"
                    class="btn-toggle"
                    id="toggleAuthMode">

                    Create New Account

                </button>
                `;

        }

    }


    // =========================================================
    // OPEN AUTHOR MODAL
    // =========================================================

    if (submitArticleBtn && authModal) {

        submitArticleBtn.addEventListener(
            'click',
            () => {

                showRegistrationScreen();

                authModal.classList.remove(
                    'hidden'
                );

            }
        );

    }


    // =========================================================
    // CLOSE AUTHOR MODAL
    // =========================================================

    if (closeModalBtn && authModal) {

        closeModalBtn.addEventListener(
            'click',
            () => {

                authModal.classList.add(
                    'hidden'
                );

            }
        );

    }


    // =========================================================
    // SWITCH LOGIN / REGISTRATION
    // =========================================================

    document.addEventListener(
        'click',
        event => {

            if (
                event.target &&
                event.target.id ===
                'toggleAuthMode'
            ) {

                if (isAuthorLoginMode) {

                    showRegistrationScreen();

                }

                else {

                    showLoginScreen();

                }

            }

        }
    );


    // =========================================================
    // CLOSE MODALS WHEN CLICKING OUTSIDE
    // =========================================================

    window.addEventListener(
        'click',
        event => {

            if (
                authModal &&
                event.target === authModal
            ) {

                authModal.classList.add(
                    'hidden'
                );

            }


            if (
                subModal &&
                event.target === subModal
            ) {

                subModal.classList.add(
                    'hidden'
                );

            }

        }
    );


    // =========================================================
    // AUTHOR REGISTRATION / LOGIN
    // =========================================================

    if (authorAuthForm) {

        authorAuthForm.addEventListener(
            'submit',
            event => {

                event.preventDefault();


                const emailInput =
                    document.getElementById('email');

                const passwordInput =
                    document.getElementById('password');


                const email =
                    emailInput
                        ? emailInput.value.trim()
                        : '';


                const password =
                    passwordInput
                        ? passwordInput.value
                        : '';


                if (!email || !password) {

                    alert(
                        'Please enter your email and password.'
                    );

                    return;

                }


                // =========================================
                // REGISTRATION
                // =========================================

                if (!isAuthorLoginMode) {

                    const fullNameInput =
                        document.getElementById(
                            'fullName'
                        );


                    const fullName =
                        fullNameInput &&
                        fullNameInput.value.trim()

                            ?

                        fullNameInput.value.trim()

                            :

                        'Author';


                    // Check existing email

                    const existingAuthor =
                        registeredAuthors.find(
                            author =>
                                author.email.toLowerCase() ===
                                email.toLowerCase()
                        );


                    if (existingAuthor) {

                        alert(
                            'An account with this email already exists. Please sign in.'
                        );


                        showLoginScreen();


                        if (emailInput) {

                            emailInput.value =
                                email;

                        }


                        return;

                    }


                    // Generate author ID

                    const uniqueId =
                        generateUniqueAuthorId();


                    // Create author

                    const newAuthor = {

                        name: fullName,

                        email: email,

                        password: password,

                        authorId: uniqueId

                    };


                    // Save author

                    registeredAuthors.push(
                        newAuthor
                    );


                    alert(
                        `🎉 REGISTRATION SUCCESSFUL!\n\n` +

                        `Welcome, ${fullName}.\n` +

                        `Your Unique Author ID is: ${uniqueId}\n\n` +

                        `Please log in now to continue.`
                    );


                    // Move to login

                    showLoginScreen();


                    if (emailInput) {

                        emailInput.value =
                            email;

                    }


                    if (passwordInput) {

                        passwordInput.value =
                            '';

                    }


                    return;

                }


                // =========================================
                // LOGIN
                // =========================================

                const foundAuthor =
                    registeredAuthors.find(
                        author =>

                            author.email.toLowerCase() ===
                            email.toLowerCase()

                            &&

                            author.password ===
                            password
                    );


                if (foundAuthor) {

                    currentLoggedInAuthor =
                        foundAuthor;


                    alert(

                        `Login Successful!\n\n` +

                        `Welcome back, ${foundAuthor.name}.\n` +

                        `Author ID: ${foundAuthor.authorId}`

                    );


                    const authorInput =
                        document.getElementById(
                            'in-author'
                        );


                    if (authorInput) {

                        authorInput.value =
                            `${foundAuthor.name} (${foundAuthor.authorId})`;

                    }


                    authModal.classList.add(
                        'hidden'
                    );


                    authorAuthForm.reset();

                }


                else if (
                    registeredAuthors.length === 0
                ) {

                    alert(
                        'No registered account found. Please complete Registration first.'
                    );


                    showRegistrationScreen();

                }


                else {

                    alert(
                        'Incorrect Email or Password. Please try again or register a new account.'
                    );

                }

            }
        );

    }


    // =========================================================
    // SUBSCRIBER LOGIN
    // =========================================================

    const subModal =
        document.getElementById('subModal');

    const closeSubModalBtn =
        document.getElementById(
            'closeSubModalBtn'
        );

    const subAuthForm =
        document.getElementById(
            'subAuthForm'
        );


    // Subscriber button

    if (
        subscriberBtn &&
        subModal
    ) {

        subscriberBtn.addEventListener(
            'click',
            () => {


                // Sign out

                if (
                    userHasPaidSubscription
                ) {

                    userHasPaidSubscription =
                        false;


                    if (userStatusTag) {

                        userStatusTag.textContent =
                            'GUEST VIEW';

                        userStatusTag.classList.remove(
                            'active-sub'
                        );

                    }


                    subscriberBtn.textContent =
                        'Subscriber Sign In';


                    subscriberBtn.classList.remove(
                        'logged-in'
                    );


                    drawArticlesFeed();


                    alert(
                        'You have signed out of your Subscriber Account.'
                    );

                }


                // Sign in

                else {

                    subModal.classList.remove(
                        'hidden'
                    );

                }

            }
        );

    }


    // Close subscriber modal

    if (
        closeSubModalBtn &&
        subModal
    ) {

        closeSubModalBtn.addEventListener(
            'click',
            () => {

                subModal.classList.add(
                    'hidden'
                );

            }
        );

    }


    // Subscriber login

    if (subAuthForm) {

        subAuthForm.addEventListener(
            'submit',
            event => {

                event.preventDefault();


                const subEmailInput =
                    document.getElementById(
                        'subEmail'
                    );


                const subEmail =
                    subEmailInput
                        ? subEmailInput.value.trim()
                        : '';


                if (!subEmail) {

                    alert(
                        'Please enter your subscriber email.'
                    );

                    return;

                }


                // Demo subscriber access

                userHasPaidSubscription =
                    true;


                if (userStatusTag) {

                    userStatusTag.textContent =
                        'VERIFIED CLIENT ACCOUNT';

                    userStatusTag.classList.add(
                        'active-sub'
                    );

                }


                if (subscriberBtn) {

                    subscriberBtn.textContent =
                        'Sign Out';

                    subscriberBtn.classList.add(
                        'logged-in'
                    );

                }


                alert(
                    `Subscriber Access Granted for: ${subEmail}\n` +
                    `Restricted Genemodelix articles are now unlocked.`
                );


                subModal.classList.add(
                    'hidden'
                );


                subAuthForm.reset();


                drawArticlesFeed();

            }
        );

    }


    // =========================================================
    // INITIALIZE WEBSITE
    // =========================================================

    drawArticlesFeed();

});