import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import algoliasearch from 'algoliasearch';
import { nanoid } from 'nanoid';

dotenv.config();

/**
 * ALGOLIA APPLICATION ID environment variable
 */
const Algolia_Application_ID = process.env.ALGOLIA_APPLICATION_ID;

/**
 * ALGOLIA API KEY environment variable
 */
const Algolia_API_Key = process.env.ALGOLIA_API_KEY;

/**
 * ALGOLIA INDEX PROPERTIES environment variable
 */
const Index_properties = process.env.ALGOLIA_INDEX_PROPERTIES;

/**
 * ALGOLIA INDEX PROJECTS environment variable
 */
const Index_projects = process.env.ALGOLIA_INDEX_PROJECTS;

/**
 * ALGOLIA INDEX AGENCIES environment variable
 */
const Index_agencies = process.env.ALGOLIA_INDEX_AGENCIES;

/**
 * ALGOLIA INDEX BLOG environment variable
 */
const Index_blog = process.env.ALGOLIA_INDEX_BLOG;

/**
 * ALGOLIA INDEX CITIES environment variable
 */
const Index_cities = process.env.ALGOLIA_INDEX_CITIES;

/**
 * ALGOLIA INDEX TAGS environment variable
 */
const Index_tags = process.env.ALGOLIA_INDEX_TAGS;

/**
 * Algolia Client initialization
 */
export const algoliaClient = algoliasearch(Algolia_Application_ID, Algolia_API_Key);

/**
 * Algolia property index initialization
 */
export const algoliaIndexProperties = algoliaClient.initIndex(Index_properties);

/**
 * Algolia project index initialization
 */
export const algoliaIndexProjects = algoliaClient.initIndex(Index_projects);

/**
 * Algolia agency index initialization
 */
export const algoliaIndexAgencies = algoliaClient.initIndex(Index_agencies);

/**
 * Algolia blog index initialization
 */
export const algoliaIndexBlog = algoliaClient.initIndex(Index_blog);

/**
 * Algolia city index initialization
 */
export const algoliaIndexCities = algoliaClient.initIndex(Index_cities);

/**
 * Algolia tag index initialization
 */
export const algoliaIndexTags = algoliaClient.initIndex(Index_tags);


/**
 * Local storage object
 */
export const storage = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + '_' + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
};

/**
 * Transform values from string
 * @param dto
 * Object being transform 
 * @returns 
 * Transformed object
 */
export function transformDtos(dto) {
    let keys = Object.keys(dto);
    keys.forEach((item: any) => {
        if (dto[`${item}`] === 'null') {
            dto[item] = null;
        }
        else if (dto[`${item}`] === 'true') {
            dto[item] = true;
        }
        else if (dto[`${item}`] === 'false') {
            dto[item] = false;
        }
    });
    return dto;
}

/**
 * Get reset password template
 * @param link 
 * Reset password link
 * @returns 
 * String containing HTML
 */
export function getResetPasswordTemplate(link){
    return `<!doctype html>
    <html lang="en-US">
    <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password Email Template.">
        <style type="text/css">
            a:hover {
                text-decoration: underline !important;
            }
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1
                                                style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                                You have
                                                requested to reset your password</h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                We cannot simply send you your old password. A unique link to reset your
                                                password has been generated for you. To reset your password, click the
                                                following link and follow the instructions.
                                            </p>
                                            <a href="${link}"
                                                style="background:#2A94E2;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                Password</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
        <!--/100% body table-->
    </body>
    </html>`
}

/**
 * Get short reference no
 * @returns 
 * Short reference no
 */
export function getUUID() {
    return nanoid(12);
}